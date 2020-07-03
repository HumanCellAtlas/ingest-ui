import {Component, OnInit} from '@angular/core';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';
import {FormControl} from '@angular/forms';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {MetadataFormService} from '../../metadata-schema-form/metadata-form.service';

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.css']
})
export class ProjectIdComponent implements OnInit {
  metadataForm: MetadataForm;

  projectShortNameKey = 'project.content.project_core.project_short_name';
  projectShortNameCtrl: FormControl;
  projectShortNameMetadata: Metadata;

  technology: string;
  otherTechnology: string;
  contributor: string;
  organism: string;

  autogenerate = false;

  delimiter = '-';

  constructor(private metadataFormService: MetadataFormService) {
  }

  ngOnInit(): void {
    this.projectShortNameMetadata = this.metadataForm.get(this.projectShortNameKey);
    this.projectShortNameCtrl = this.metadataForm.getControl(this.projectShortNameKey) as FormControl;

    if (this.autogenerate) {
      this.projectShortNameCtrl.disable();
      this.generateProjectId();
    }

    this.metadataForm.getControl('project.technology.ontologies').valueChanges.subscribe(val => {
      const technologies = this.metadataFormService.cleanFormData(val);
      let technology = technologies.length > 0 ? technologies[0]['ontology_label'] : '';
      technology = technology.replace(/\'/g, 'p');
      technology = this.removeSpecialChars(technology);
      technology = this.camelize(technology);
      technology = this.capitalize(technology);
      this.technology = technology;
      this.generateProjectId();
    });

    this.metadataForm.getControl('project.technology.others').valueChanges.subscribe(val => {
      const otherTechnologies = this.metadataFormService.cleanFormData(val);
      let technology = otherTechnologies && otherTechnologies.length > 0 ? otherTechnologies[0] : '';
      technology = technology.replace(/\'/g, 'p');
      technology = this.removeSpecialChars(technology);
      technology = this.camelize(technology);
      technology = this.capitalize(technology);
      this.otherTechnology = technology;
      this.generateProjectId();
    });

    this.metadataForm.getControl('project.content.contributors').valueChanges.subscribe(val => {
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
    });

    this.metadataForm.getControl('project.identifyingOrganisms').valueChanges.subscribe(val => {
      const identifyingOrganisms = this.metadataFormService.cleanFormData(val);
      this.organism = identifyingOrganisms && identifyingOrganisms.length > 0 ? identifyingOrganisms[0] : '';
      this.generateProjectId();
    });
  }

  generateProjectId() {
    if (this.autogenerate) {
      const technology = this.technology ? this.technology : this.otherTechnology ? this.otherTechnology : 'Unspecified';
      const organism = this.organism ? this.organism : 'Unspecified';
      this.projectShortNameCtrl.setValue([this.contributor, organism, technology].join(this.delimiter));
    }
  }

  onAutoGenerateChange() {
    if (this.autogenerate) {
      this.projectShortNameCtrl.disable();
      this.generateProjectId();
    } else {
      this.projectShortNameCtrl.enable();
    }
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  removeSpecialChars(str: string): string {
    return str.replace(/[\W]+/g, '');
  }

  capitalize(str: string): string {
    return str.replace(/\b(\w)/g, s => s.toUpperCase());
  }

}
