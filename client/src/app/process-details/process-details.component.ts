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
  processUrl: string;

  @Input()
  schemaUrl: string;

  processId: string;

  inputBiomaterials: MetadataDocument[];
  protocols: MetadataDocument[];
  derivedBiomaterials: MetadataDocument[];
  derivedFiles: MetadataDocument[];

  protocolsToAdd: MetadataDocument[] = [];
  inputBiomaterialsToAdd: MetadataDocument[] = [];
  outputBiomaterialsToAdd: MetadataDocument[] = [];
  outputFilesToAdd: MetadataDocument[] = [];

  links: Link[] = [];
  nodes: NgxNode[] = [];
  done: boolean;

  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<any> = new Subject();

  constructor(private ingestService: IngestService) {
  }

  ngOnInit(): void {
    this.processId = this.getIdFromUrl(this.processUrl);
    this.refreshGraph();
  }

  updateGraph() {
    this.update$.next(true);
  }

  getConcreteType(metadata: MetadataDocument): string {
    return metadata.content['describedBy'].split('/').pop();
  }

  fitGraph() {
    this.zoomToFit$.next(true);
  }

  onProtocolPicked($event: MetadataDocument) {
    this.protocolsToAdd.push($event);
  }

  onDerivedBiomaterialPicked($event: MetadataDocument) {
    this.outputBiomaterialsToAdd.push($event);
  }

  onDerivedFilePicked($event: MetadataDocument) {
    this.outputFilesToAdd.push($event);
  }

  onInputBiomaterialPicked($event: MetadataDocument) {
    this.inputBiomaterialsToAdd.push($event);
  }

  // TODO Add success or error status for add and remove operations

  removeInputBiomaterial(biomaterial: MetadataDocument) {
    const biomaterialId = this.getId(biomaterial);
    this.ingestService.deleteInputBiomaterialFromProcess(this.processId, biomaterialId).subscribe(data => {
      console.log('deleteInputBiomaterialFromProcess', data);
      this.refreshGraph();
    });
  }

  removeProtocol(protocol: MetadataDocument) {
    const protocolId = this.getId(protocol);
    this.ingestService.deleteProtocolFromProcess(this.processId, protocolId).subscribe(data => {
      this.refreshGraph();
    });
  }

  removeOutputBiomaterial(biomaterial: MetadataDocument) {
    const biomaterialId = this.getId(biomaterial);
    this.ingestService.deleteOutputBiomaterialFromProcess(this.processId, biomaterialId).subscribe(data => {
      console.log('deleteOutputBiomaterialFromProcess', data);
      this.refreshGraph();
    });
  }

  removeOutputFile(file: MetadataDocument) {
    const fileId = this.getId(file);
    this.ingestService.deleteOutputFileFromProcess(this.processId, fileId).subscribe(data => {
      this.refreshGraph();
    });
  }

  // TODO Check if POST with comma-delimited resource uri's payload will do linking to all resources in the uri list
  addProtocols() {
    const tasks = this.protocolsToAdd.map(protocol => this.ingestService.addProtocolToProcess(this.processId, this.getId(protocol)));
    forkJoin(tasks).subscribe(
      data => {
        this.protocolsToAdd = [];
        this.refreshGraph();
      }
    );
  }

  addOutputFiles() {
    const tasks = this.outputFilesToAdd.map(file => this.ingestService.addOutputFileToProcess(this.processId, this.getId(file)));
    forkJoin(tasks).subscribe(
      data => {
        this.outputFilesToAdd = [];
        this.refreshGraph();
      }
    );
  }

  addInputBiomaterials() {
    const tasks = this.inputBiomaterialsToAdd.map(biomaterial => {
      const biomaterialId = this.getId(biomaterial);
      return this.ingestService.addInputBiomaterialToProcess(this.processId, biomaterialId);
    });

    forkJoin(tasks).subscribe(
      data => {
        this.inputBiomaterialsToAdd = [];
        this.refreshGraph();
      }
    );
  }

  addOutputBiomaterials() {
    const tasks = this.outputBiomaterialsToAdd.map(biomaterial => {
      const biomaterialId = this.getId(biomaterial);
      return this.ingestService.addOutputBiomaterialToProcess(this.processId, biomaterialId);
    });

    forkJoin(tasks).subscribe(
      data => {
        this.outputBiomaterialsToAdd = [];
        this.refreshGraph();
      }
    );
  }

  // TODO Create endpoint in Core to return all protocols, inputBiomaterials, derivedBiomaterials,derivedFiles for a process
  private refreshGraph() {
    this.done = false;
    this.initGraphModel();
    forkJoin(
      {
        protocols: this.getProtocols(this.processUrl),
        inputBiomaterials: this.getInputBiomaterials(this.processUrl),
        derivedBiomaterials: this.getDerivedBiomaterials(this.processUrl),
        derivedFiles: this.getDerivedFiles(this.processUrl)
      }
    ).subscribe(
      data => {
        this.done = true;
        this.updateGraph();
      }
    );
  }

  private getInputBiomaterials(processUrl: string): Observable<ListResult<MetadataDocument>> {
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

  private getProtocols(processUrl: string): Observable<ListResult<MetadataDocument>> {
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

  private getDerivedBiomaterials(processUrl: string) {
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

  private getDerivedFiles(processUrl) {
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

  private getId(metadata: MetadataDocument) {
    return this.getIdFromUrl(metadata._links['self']['href']).split('/').pop();
  }

  private getIdFromUrl(url: string): string {
    return url.split('/').pop();
  }

  private initGraphModel() {
    this.nodes = [{
      id: 'process',
      label: 'process'
    }];
    this.links = [];
  }


}


