import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {AbstractControl, FormControl} from '@angular/forms';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {MetadataFormService} from '../../metadata-schema-form/metadata-form.service';
import {IngestService} from '../../shared/services/ingest.service';
import {Observable, timer} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.css']
})
export class ProjectIdComponent implements OnInit {
  metadataForm: MetadataForm;

  projectShortNameKey = 'project.content.project_core.project_short_name';
  projectIdCtrl: FormControl;
  projectIdMetadata: Metadata;

  technologyKey = 'project.technology.ontologies';
  technologyMetadata: Metadata;
  technologyCtrl: FormControl;
  parentTechnologyCtrl: FormControl;

  otherTechnologyKey = 'project.technology.others';
  otherTechnologyMetadata: Metadata;
  otherTechnologyCtrl: FormControl;

  identifyingOrganismKey = 'project.identifyingOrganisms';
  identifyingOrganismMetadata: Metadata;
  identifyingOrganismCtrl: FormControl;


  technology: string;
  otherTechnology: string;
  contributor: string;
  organism: string;

  autogenerate = false;

  delimiter = '-';
  label: string;

  index = 0;


  constructor(private metadataFormService: MetadataFormService,
              private ingestService: IngestService) {
  }

  ngOnInit(): void {
    this.projectIdMetadata = this.metadataForm.get(this.projectShortNameKey);
    this.technologyMetadata = this.metadataForm.get(this.technologyKey);
    this.otherTechnologyMetadata = this.metadataForm.get(this.otherTechnologyKey);
    this.identifyingOrganismMetadata = this.metadataForm.get(this.identifyingOrganismKey);

    this.projectIdCtrl = this.metadataForm.getControl(this.projectShortNameKey) as FormControl;
    this.technologyCtrl = this.metadataForm.getControl(this.technologyKey) as FormControl;
    this.otherTechnologyCtrl = this.metadataForm.getControl(this.otherTechnologyKey) as FormControl;
    this.identifyingOrganismCtrl = this.metadataForm.getControl(this.identifyingOrganismKey) as FormControl;

    this.parentTechnologyCtrl = this.metadataForm.getControl('project.technology') as FormControl;
    this.parentTechnologyCtrl.setValidators([requireTechnologyValidator(this.metadataFormService)]);
    this.parentTechnologyCtrl.updateValueAndValidity();

    this.projectIdCtrl.setAsyncValidators([uniqueProjectIdAsyncValidator(this.ingestService)]);
    this.projectIdCtrl.updateValueAndValidity();

    this.setUpValueChangeHandlers();

    this.label = this.projectIdMetadata.schema.user_friendly || this.projectIdMetadata.schema.title || this.projectIdMetadata.key;
  }

  onAutogenerateChange() {
    this.projectIdMetadata.isReadOnly = this.autogenerate;
    this.generateProjectId();
  }

  checkForErrors(control: AbstractControl): string {
    control = control as FormControl;
    if ((control.touched || control.dirty) && control.invalid && control.errors) {
      const errors = this.projectIdCtrl.errors;
      if (errors['required']) {
        return 'This field is required.';
      }
      if (errors['exists']) {
        return 'This label already exists. Please choose a different label.';
      }
    }
  }

  checkProjectCount(projectId: string): Observable<number> {
    const query = [];
    const criteria = {
      'contentField': 'content.project_core.project_short_name',
      'operator': 'REGEX',
      'value': projectId
    };
    query.push(criteria);
    return this.ingestService.queryProjects(query).map(data => {
      return data.page['totalElements'];
    });
  }

  private setUpValueChangeHandlers() {
    this.metadataForm.getControl('project.technology.ontologies')
      .valueChanges
      .subscribe(val => {
        this.onTechnologyChange(val);

      });

    this.metadataForm.getControl('project.technology.others')
      .valueChanges
      .subscribe(val => {
        this.onOtherTechnologyChange(val);
      });

    this.metadataForm.getControl('project.content.contributors')
      .valueChanges
      .subscribe(val => {
        this.onContributorChange(val);
      });

    this.metadataForm.getControl('project.identifyingOrganisms')
      .valueChanges
      .subscribe(val => {
        this.onOrganismChange(val);
      });
  }

  private generateProjectId() {
    if (this.autogenerate) {
      const technology = this.technology ? this.technology : this.otherTechnology ? this.otherTechnology : 'Unspecified';
      const organism = this.organism ? this.organism : 'Unspecified';
      const projectId = [this.contributor, organism, technology].join(this.delimiter);
      this.checkProjectCount(projectId).subscribe(count => {
        const suffix = count ? '--' + (++count).toString() : '';
        this.projectIdCtrl.setValue(projectId + suffix, {emitEvent: false});
      });
    }
  }

  private camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  private removeSpecialChars(str: string): string {
    return str.replace(/[\W]+/g, '');
  }

  private capitalize(str: string): string {
    return str.replace(/\b(\w)/g, s => s.toUpperCase());
  }

  private onContributorChange(val: any) {
    const contributors = this.metadataFormService.cleanFormData(val);
    const correspondents = contributors.filter(contributor => contributor['corresponding_contributor'] === true);
    let name = correspondents.length > 0 ? correspondents[0]['name'] : '';
    name = name ? name : contributors && contributors.length > 0 ? contributors[0]['name'] : '';
    name = name || '';
    name = name.split(',').pop();
    name = this.camelize(name);
    name = this.capitalize(name);
    this.contributor = this.removeSpecialChars(name);
    this.generateProjectId();
  }

  private onTechnologyChange(val: any) {
    const technologies = this.metadataFormService.cleanFormData(val);
    let technology = technologies && technologies.length > 0 ? technologies[0]['ontology_label'] : '';
    technology = technology.replace(/\'/g, 'p');
    technology = this.removeSpecialChars(technology);
    technology = this.camelize(technology);
    technology = this.capitalize(technology);
    this.technology = technology;
    this.generateProjectId();
  }

  private onOtherTechnologyChange(val: any) {
    const otherTechnologies = this.metadataFormService.cleanFormData(val);
    let technology = otherTechnologies && otherTechnologies.length > 0 ? otherTechnologies[0] : '';
    technology = technology.replace(/\'/g, 'p');
    technology = this.removeSpecialChars(technology);
    technology = this.camelize(technology);
    technology = this.capitalize(technology);
    this.otherTechnology = technology;
    this.generateProjectId();
  }

  private onOrganismChange(val: any) {
    const identifyingOrganisms = this.metadataFormService.cleanFormData(val);
    this.organism = identifyingOrganisms && identifyingOrganisms.length > 0 ? identifyingOrganisms[0] : '';
    this.generateProjectId();
  }

}


export const uniqueProjectIdAsyncValidator = (ingestService: IngestService, time: number = 500) => {
  return (input: FormControl) => {
    const query = [];
    const criteria = {
      'contentField': 'content.project_core.project_short_name',
      'operator': 'IS',
      'value': input.value
    };
    query.push(criteria);

    return timer(time).pipe(
      distinctUntilChanged(),
      switchMap(() => ingestService.queryProjects(query)),
      map(res => {
        return res.page['totalElements'] === 0 ? null : {exists: true};
      })
    );
  };
};

export const requireTechnologyValidator = (metadataFormService: MetadataFormService) => {
  return (input: FormControl) => {
    const technology = metadataFormService.cleanFormData(input.value);
    console.log('technology', technology)
    console.log('technology empty?', metadataFormService.isEmpty(technology))
    if (metadataFormService.isEmpty(technology)) {
      return {required: true};
    }
  };
};
