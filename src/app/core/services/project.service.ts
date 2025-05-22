import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  readonly baseUrl = '/api/projects'; 
  client =  inject(HttpClient)
  constructor() { }

  getProjects(): Observable<Project[]> {
    return this.client.get<Project[]>(`${this.baseUrl}`);
  }

  getProjectById(id: string): Observable<Project> {
    return this.client.get<Project>(`${this.baseUrl}/${id}`);
  }

  addProject(project: any): Observable<Project> {
    return this.client.post<Project>(this.baseUrl, project);
  }

  updateProject(project: any): Observable<Project> {
    return this.client.put<Project>(`${this.baseUrl}/${project.id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.client.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTasksByProject(projectId: string): Observable<Task[]> {
    return this.client.get<Task[]>(`${this.baseUrl}/${projectId}/tasks`);
  }

  addTask(task: any): Observable<Task> {
    return this.client.post<Task>(`${this.baseUrl}/${task.projectId}/tasks`, task);
  }

  updateTask(task: any): Observable<Task> {
    return this.client.put<Task>(`${this.baseUrl}/${task.projectId}/tasks/${task.id}`, task);
  }

  deleteTask(taskId: string, projectId: string): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${projectId}/tasks/${taskId}`);
  }

}
