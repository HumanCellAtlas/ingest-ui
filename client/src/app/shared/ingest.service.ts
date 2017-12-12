import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {SubmissionEnvelope} from "./models/submissionEnvelope";
import {ListResult} from "./models/hateoas";
import {Summary} from "../home/welcome/summary";
import {Project} from "./models/project";
import {Metadata} from "./models/metadata";

@Injectable()
export class IngestService {

  // API_URL: string = 'http://api.ingest.integration.data.humancellatlas.org/';
  // API_URL: string = 'http://192.168.99.100:31763';
  // API_URL: string = 'http://ingest.integration.data.humancellatlas.org';
  API_URL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getAllSubmissions(): Observable<SubmissionEnvelope[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`, {params: {'sort':'submissionDate,desc'}})
      .map((data: ListResult<SubmissionEnvelope>) => _.values(data._embedded.submissionEnvelopes))
      .do(console.log);
  }

  public getAllSubmissionsHAL(): Observable<ListResult<SubmissionEnvelope>> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes`)
      .map((data: ListResult<SubmissionEnvelope>) => _.values(data))
      .do(console.log);
  }

  // public pollSubmissionsHAL():  Observable<ListResult<SubmissionEnvelope>> {
  //   return Observable.interval(5000).switchMap(() => this.getAllSubmissionsHAL());
  // }

  public getSummary(): Observable<Summary> {
    return this.http.get(`${this.API_URL}/user/summary`)
      .map((data: Summary) => _.values(data))
      .do(console.log);
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get(`${this.API_URL}/projects`)
      .map((data: ListResult<Project>) => _.values(data._embedded.projects))
      .do(console.log);
  }

  public getFiles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/files`)
      .map((data: ListResult<Object>) => _.values(data._embedded.files))
      .do(console.log);
  }

  public getSamples(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/samples`)
      .map((data: ListResult<Object>) => _.values(data._embedded.samples))
      .do(console.log);
  }

  public getAnalyses(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/analyses`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.analyses)
          return _.values(data._embedded.analyses);
        else
          return [];
      })
      .do(console.log);
  }

  public getAssays(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/assays`)
      .map((data: ListResult<Object>) => _.values(data._embedded.assays))
      .do(console.log);
  }

  //there was no pagination, check core code
  public getBundles(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/bundleManifests`)
      .map((data: ListResult<Object>) => {
        if(data._embedded && data._embedded.bundleManifests)
          return _.values(data._embedded.bundleManifests);
        else
          return [];
      })
      .do(console.log);
  }

  public getProtocols(id): Observable<Object[]> {
    return this.http.get(`${this.API_URL}/submissionEnvelopes/${id}/protocols`)
      .map((data: ListResult<Object>) => _.values(data._embedded.protocols))
      .do(console.log);
  }


  public submit(submitLink){
    this.http.put(submitLink, null).subscribe(
      res=> {
        console.log(res)
      },
      err => {
        console.log(err)
      }
    )
  }

  public getSubmission(id): Observable<SubmissionEnvelope>{
    return this.http.get<SubmissionEnvelope>(`${this.API_URL}/submissionEnvelopes/${id}`);
  }

  public postProject(newProject) {


    // newProject = {
    //   "name": "Single-cell RNA-seq analysis of human pancreas from healthy individuals and type 2 diabetes patients",
    //   "contributors": [{
    //     "city": "Stockholm",
    //     "name": "Rickard,,Sandberg",
    //     "country": "Sweden",
    //     "institution": "Department of Cell and Molecular Biology (CMB), Karolinska Institutet, Stockholm, Sweden. Ludwig Institute for Cancer Research, Stockholm, Sweden. Integrated Cardiometabolic Center (ICMC), Karolinska Institutet, Stockholm, Sweden.",
    //     "address": "Nobels vag 3, 171 77",
    //     "email": "Rickard.Sandberg@ki.se"
    //   },
    //     {
    //       "city": "Stockholm",
    //       "name": "Asa,,Segerstolpe",
    //       "country": "Sweden",
    //       "institution": "Department of Cell and Molecular Biology (CMB), Karolinska Institutet, Stockholm, Sweden. Integrated Cardiometabolic Center (ICMC), Karolinska Institutet, Stockholm, Sweden.",
    //       "address": "Nobels vag 3, 171 77",
    //       "email": "Asa.Segerstolpe@ki.se"
    //     }
    //   ],
    //   "submitters": [{
    //     "city": "Stockholm",
    //     "name": "Athanasia,,Palasantza",
    //     "country": "Sweden",
    //     "institution": "Department of Cell and Molecular Biology (CMB), Karolinska Institutet, Stockholm, Sweden.",
    //     "phone": "0046 8 5248 3986",
    //     "address": "Nobels vag 3, 171 77",
    //     "email": "Athanasia.Palasantza@ki.se"
    //   }],
    //   "insdc_project": "ERP017126",
    //   "experimental_design": [{
    //     "text": "cell type comparison design",
    //     "ontology": "OBI:0001411"
    //   },
    //     {
    //       "text": "disease state design",
    //       "ontology": "OBI:0001293"
    //     }
    //   ],
    //   "publications": [{
    //     "title": "Single-Cell Transcriptome Profiling of Human Pancreatic Islets in Health and Type 2 Diabetes",
    //     "doi": "10.1016/j.cmet.2016.08.020",
    //     "authors": [
    //       "Segerstolpe A, Palasantza A, Eliasson P, Andersson E, Andreasson A, Sun X, Picelli S, Sabirsh A, Clausen M, Bjursell MK, Smith DM, Kasper M, Ammala C, Sandberg R"
    //     ]
    //   }],
    //   "project_id": "HCA-demo-project 6",
    //   "insdc_study": "PRJEB15401",
    //   "description": "We used single-cell RNA-sequencing to generate transcriptional profiles of endocrine and exocrine cell types of the human pancreas. Pancreatic tissue and islets were obtained from six healthy and four T2D cadaveric donors. Islets were cultured and dissociated into single-cell suspension. Viable individual cells were distributed via fluorescence-activated cell sorted (FACS) into 384-well plates containing lysis buffer. Single-cell cDNA libraries were generated using the Smart-seq2 protocol. Gene expression was quantified as reads per kilobase transcript and per million mapped reads (RPKM) using rpkmforgenes. Bioinformatics analysis was used to classify cells into cell types without knowledge of cell types or prior purification of cell populations. We revealed subpopulations in endocrine and exocrine cell types, identified genes with interesting correlations to body mass index (BMI) in specific cell types and found transcriptional alterations in T2D.  Complementary whole-islet RNA-seq data have also been deposited at ArrayExpress under accession number E-MTAB-5060 (http://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-5060)."
    // };

    var project = {
      "core" : {
        "type": "project",
        "schema_url": "https://raw.githubusercontent.com/HumanCellAtlas/metadata-schema/4.1.0/json_schema/project.json"
      },
    }

    for (var key in newProject){
      project[key] = newProject[key];
    }


    this.http.post(`${this.API_URL}/projects`, project).subscribe(
      res=> {
         console.log(res)
      },
      err => {
         console.log(err)
      }
    )
  }
}
