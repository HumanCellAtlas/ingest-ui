import {Component, Input, OnInit} from '@angular/core';
import {Project, ProjectColumn} from '../../models/project';
import { $enum } from "ts-enum-util";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  private _projects: Project[];
  private _columns: ProjectColumn[];
  private _showUnassignedActions: Boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  get projects(): Project[] {
    return this._projects;
  }

  @Input()
  set projects(projects: Project[]) {
    this._projects = projects;
  }

  get columns(): ProjectColumn[] {
    return this._columns;
  }

  @Input()
  set columns(columns: ProjectColumn[]) {
    this._columns = columns;
  }

  get showUnassignedActions(): Boolean {
    return this._showUnassignedActions;
  }

  @Input()
  set showUnassignedActions(showUnassignedActions: Boolean) {
    this._showUnassignedActions = showUnassignedActions;
  }

  getColumnLabel(column: ProjectColumn): string {
    return $enum.mapValue(column).with({
      [ProjectColumn.api_link]: "",
      [ProjectColumn.short_name]: "HCA Project ID",
      [ProjectColumn.project_title]: "Project Title",
      [ProjectColumn.last_updated]: "Last Updated",
      [ProjectColumn.primary_contributor]: "Primary Contributor",
      [ProjectColumn.primary_wrangler]: "Primary Wrangler"
    });
  }

  getContent(column: ProjectColumn, project: Project): string {
    return $enum.mapValue(column).with({
      [ProjectColumn.api_link]: this.getApiLink(project),
      [ProjectColumn.short_name]: this.getShortName(project),
      [ProjectColumn.project_title]: this.getTitle(project),
      [ProjectColumn.last_updated]: this.getLastUpdated(project),
      [ProjectColumn.primary_contributor]: this.getContributor(project),
      [ProjectColumn.primary_wrangler]: "Wrangler Name"
      //ToDo: Include Wrangler and User Account objects in ingest-core Project object.
    });
  }

  getApiLink(project: Project) {
    return project['_links']['self']['href']
  }

  getShortName(project: Project): string {
    return project?.content['project_core']['project_short_name'];
  }

  getTitle(project: Project): string {
    return project?.content['project_core']['project_title'];
  }

  getLastUpdated(project: Project): string {
    return formatDate(project.updateDate, 'longDate', 'en-GB');
  }

  getContributor(project: Project) {
    let contributors = project && project.content && project.content['contributors'];
    contributors = contributors ? project.content['contributors'] : [];
    const correspondents = contributors.filter(contributor => contributor['corresponding_contributor'] === true);
    return correspondents.map(c => c['name']).join(' | ');
  }
}
