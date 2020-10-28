import {Component, Input, OnInit} from '@angular/core';
import {MetadataDocument} from '../shared/models/metadata-document';
import {forkJoin, Observable, Subject} from 'rxjs';
import {ListResult} from '../shared/models/hateoas';
import {tap} from 'rxjs/operators';
import {IngestService} from '../shared/services/ingest.service';
import {Link} from './link';
import {NgxNode} from './ngxNode';

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

  links: Link[] = [];
  nodes: NgxNode[] = [{
    id: 'process',
    label: 'process'
  }];
  done: boolean;

  zoomToFit$: Subject<boolean> = new Subject();

  constructor(private ingestService: IngestService) {
  }

  ngOnInit(): void {
    forkJoin(
      {
        protocols: this.getProtocols(this.selfUrl),
        inputBiomaterials: this.getInputBiomaterials(this.selfUrl),
        derivedBiomaterials: this.getDerivedBiomaterials(this.selfUrl),
        derivedFiles: this.getDerivedFiles(this.selfUrl)
      }
    ).subscribe(
      data => {
        this.done = true;
      }
    );
  }

  getInputBiomaterials(processUrl: string): Observable<ListResult<MetadataDocument>> {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/inputBiomaterials`).pipe(
      tap(data => {
        const inputs = data._embedded ? data._embedded.biomaterials : [];
        inputs.map(input => {
          this.nodes.push({
            id: input.uuid.uuid,
            label: input.content['biomaterial_core']['biomaterial_id'],
          } as NgxNode);
          this.links.push({
            id: `input-biomaterial-${input.uuid.uuid}`,
            source: input.uuid.uuid,
            target: 'process',
            label: 'input'
          } as Link);
        });

        this.inputBiomaterials = inputs;
      }));
  }

  getProtocols(processUrl: string): Observable<ListResult<MetadataDocument>> {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/protocols`).pipe(
      tap(data => {
        const protocols = data._embedded ? data._embedded.protocols : [];
        this.protocols = protocols;
        protocols.map(p => {
          this.nodes.push({
            id: p.uuid.uuid,
            label: p.content['protocol_core']['protocol_id'],
          } as NgxNode);
          this.links.push({
            id: `protocol-${p.uuid.uuid}`,
            source: 'process',
            target: p.uuid.uuid,
            label: 'protocols'
          } as Link);
        });
      }));
  }

  getDerivedBiomaterials(processUrl: string) {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/derivedBiomaterials`).pipe(
      tap(data => {
        const biomaterials = data._embedded ? data._embedded.biomaterials : [];
        this.derivedBiomaterials = biomaterials;

        biomaterials.map(b => {
          this.nodes.push({
            id: b.uuid.uuid,
            label: b.content['biomaterial_core']['biomaterial_id']
          } as NgxNode);
          this.links.push({
            id: `derived-biomaterial-${b.uuid.uuid}`,
            source: 'process',
            target: b.uuid.uuid,
            label: 'output'
          } as Link);
        });

      }));
  }

  getDerivedFiles(processUrl) {
    return this.ingestService.getAs<ListResult<MetadataDocument>>(`${processUrl}/derivedFiles`).pipe(
      tap(data => {
        const derivedFiles = data._embedded ? data._embedded.files : [];
        this.derivedFiles = derivedFiles;

        derivedFiles.map(d => {
          this.nodes.push({
            id: d.uuid.uuid,
            label: d.content['file_core']['file_name']
          } as NgxNode);
          this.links.push({
            id: `derived-file-${d.uuid.uuid}`,
            source: 'process',
            target: d.uuid.uuid,
            label: 'output'
          } as Link);
        });

      }));
  }

  getConcreteType(metadata: MetadataDocument): string {
    return metadata.content['describedBy'].split('/').pop();
  }

  fitGraph() {
    this.zoomToFit$.next(true);
  }
}

