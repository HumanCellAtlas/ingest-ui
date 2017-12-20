import {Component, Input, OnInit} from '@angular/core';
import {IngestService} from "../../shared/ingest.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() projectId;
  @Input() submissionEnvelopeId;


  project:any;

  constructor(private ingestService: IngestService, private route: ActivatedRoute) { }

  ngOnInit(){
    if(this.projectId){
      this.getProject(this.projectId)
    }
    if(this.submissionEnvelopeId){
      this.ingestService.getSubmissionProject(this.submissionEnvelopeId)
        .subscribe(project => {
          this.project = project;
        })
    }
  }

  getProject(id){
    this.ingestService.getProject(id).subscribe(data => {
      this.project = data;
    });
  }

}
