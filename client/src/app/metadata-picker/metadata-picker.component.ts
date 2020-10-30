import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MetadataDocument} from '../shared/models/metadata-document';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IngestService} from '../shared/services/ingest.service';
import {Criteria} from '../shared/models/criteria';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-metadata-picker',
  templateUrl: './metadata-picker.component.html',
  styleUrls: ['./metadata-picker.component.css']
})
export class MetadataPickerComponent implements OnInit {
  @Input()
  entityType: string;

  @Output()
  picked = new EventEmitter<MetadataDocument>();

  id: string;
  label = 'Metadata';
  placeholder: string;
  helperText: string;
  options$: Observable<MetadataDocument[]>;
  value: MetadataDocument;
  searchControl: FormControl;
  loadingResults: boolean;
  private searchField = {
    'biomaterials': 'content.biomaterial_core.biomaterial_id',
    'protocols': 'content.protocol_core.protocol_id',
    'files': 'content.file_core.file_name',
  };

  constructor(private ingestService: IngestService) {
  }

  ngOnInit(): void {
    this.searchControl = new FormControl('');
    this.loadingResults = false;
    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        filter(text => text && text.length > 2),
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => { this.loadingResults = true; }),
        switchMap(newSearch => this.onSearchValueChanged(newSearch))
      );
  }

  // TODO make this configurable, use a "metadata field accessor" given a path
  displayMetadata(metadata: MetadataDocument): string {
    if (!metadata || !metadata.content) {
      return '';
    }

    let id: string;
    let name: string;

    switch (metadata.type) {
      case 'Biomaterial':
        id = metadata.content['biomaterial_core']['biomaterial_id'];
        name = metadata.content['biomaterial_core']['biomaterial_name'];
        return `${name} [${id}]`;
      case 'File':
        const filename = metadata.content['file_core']['file_name'];
        return `${filename}`;
      case 'Protocol':
        id = metadata.content['protocol_core']['protocol_id'];
        name = metadata.content['protocol_core']['protocol_name'];
        return `${name} [${id}]`;
      default:
        return '';
    }
  }

  onSearchValueChanged(value: string): Observable<MetadataDocument[]> {
    if (typeof value !== 'string') { return; }
    const searchText = value ? value.toLowerCase() : '';
    const query: Criteria[] = [
      {
        field: this.searchField[this.entityType],
        operator: 'REGEX',
        value: searchText
      }
    ];
    return this.queryEntity(query);
  }

  getConcreteType(metadata: MetadataDocument): string {
    return metadata.content['describedBy'].split('/').pop();
  }

  onSelectedValueChange($event: MatAutocompleteSelectedEvent) {
    this.picked.emit($event.option.value);
    this.searchControl.reset();
  }

  private queryEntity(query: Criteria[]): Observable<MetadataDocument[]> {
    const queryEntity = this.ingestService.getQueryEntity(this.entityType);
    return queryEntity(query).pipe(
      map(data => {
        return data && data._embedded ? data._embedded[this.entityType] : [];
      }),
      tap(() => {
        this.loadingResults = false;
      }));
  }
}
