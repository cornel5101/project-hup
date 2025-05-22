import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  readonly baseUrl = '/api/tasks'; 
  client =  inject(HttpClient);

  constructor() { }

  getTasks(): Observable<Task[]> {
    return this.client.get<Task[]>(`${this.baseUrl}`);
  }
}
