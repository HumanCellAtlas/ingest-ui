import {Component, Input, OnInit} from '@angular/core';
import {MetadataDocument} from '../shared/models/metadata-document';
import {Observable} from 'rxjs';
import {ListResult} from '../shared/models/hateoas';
import {tap} from 'rxjs/operators';
import {IngestService} from '../shared/services/ingest.service';

@Component({
  selector: 'app-process-details',
  templateUrl: './process-details.component.html',
  styleUrls: ['./process-details.component.css']
})
export class ProcessDetailsComponent implements OnInit {

  @Input()
  selfUrl: string;

  @Input()
  schemaUrl: string;

  inputBiomaterials: MetadataDocument[];
  protocols: MetadataDocument[];
  derivedBiomaterials: MetadataDocument[];
  derivedFiles: MetadataDocument[];

  constructor(private ingestService: IngestService) {
  }

  ngOnInit(): void {
    this.getProtocols(this.selfUrl).subscribe();
    this.getInputBiomaterials(this.selfUrl).subscribe();
    this.getDerivedBiomaterials(this.selfUrl).subscribe();
    this.getDerivedFiles(this.selfUrl).subscribe();
  }

  getInputBiomaterials(processUrl: string): Observable<ListResult<MetadataDocument>> {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/inputBiomaterials`).pipe(
      tap(data => {
        const inputs = data._embedded ? data._embedded.biomaterials : [];
        this.inputBiomaterials = inputs;
      }));
  }

  getProtocols(processUrl: string): Observable<ListResult<MetadataDocument>> {
    console.log('get protocols');
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/protocols`).pipe(
      tap(data => {
        const protocols = data._embedded ? data._embedded.protocols : [];
        this.protocols = protocols;
      }));
  }

  getDerivedBiomaterials(processUrl: string) {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/derivedBiomaterials`).pipe(
      tap(data => {
        const biomaterials = data._embedded ? data._embedded.biomaterials : [];
        this.derivedBiomaterials = biomaterials;
      }));
  }

  getDerivedFiles(processUrl) {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/derivedFiles`).pipe(
      tap(data => {
        const derivedFiles = data._embedded ? data._embedded.files : [];
        this.derivedFiles = derivedFiles;
      }));
  }

  getConcreteType(metadata: MetadataDocument): string {
    return metadata.content['describedBy'].split('/').pop();
  }

}

