import {Component, Input, OnInit} from '@angular/core';
import {Metadata} from '../../metadata-schema-form/models/metadata';
import {AbstractControl} from '@angular/forms';
import {MetadataForm} from '../../metadata-schema-form/models/metadata-form';

@Component({
  selector: 'app-publication-field-group',
  templateUrl: './publication-field-group.component.html',
  styleUrls: ['./publication-field-group.component.css']
})
export class PublicationFieldGroupComponent implements OnInit {
  @Input()
  metadataForm: MetadataForm;

  publicationUrlMetadata: Metadata;
  publicationUrlControl: AbstractControl;

  publicationUrlId = 'project.content.publications.url';
  publicationKey = 'project.content.publications';

  constructor() {
  }

  ngOnInit(): void {
    this.publicationUrlMetadata = this.metadataForm.get(this.publicationUrlId);
    const publicationsControl = this.metadataForm.getControl(this.publicationKey);
    this.publicationUrlControl = publicationsControl['controls'][0]['controls']['url'];
  }


}
