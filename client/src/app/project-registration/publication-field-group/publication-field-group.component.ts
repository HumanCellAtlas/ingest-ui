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
  publicationUrlId: string;

  constructor() { }

  ngOnInit(): void {
    this.publicationUrlMetadata = this.metadataForm.get('project.content.publications.url')
    const publicationsControl = this.metadataForm.getControl('project.content.publications');

    this.publicationUrlControl = publicationsControl['controls'][0]['controls']['url'];

    this.publicationUrlId = 'project.content.publications.url';
  }


}
