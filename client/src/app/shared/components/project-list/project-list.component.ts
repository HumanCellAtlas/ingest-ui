import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {
  private _projects :Project[];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  @Input()
  set projects(projects: Project[]) {
    this._projects = projects
  }

  get projects(): Project[] {
    return this._projects;
  }
  redirect(){
    this.router.navigate(['projects/new']);
  }

}
