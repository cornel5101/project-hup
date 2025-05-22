import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Project } from '../../models/project.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  projects: Project[] = [];
  userCount: number = 0;
  projectCount: number = 0;
  taskCount: number = 0;

  constructor(private fb: FormBuilder, private projectService: ApiService) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadDashboardStats();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  loadDashboardStats() {
    this.projectService.getDashboardStats().subscribe(data => {
      this.userCount = data.users;
      this.projectCount = data.projects;
      this.taskCount = data.tasks;
    });
  }

}
