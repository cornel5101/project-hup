import { computed, signal } from '@angular/core';
import { Injectable } from '@angular/core';
import { Task } from '../../../models/task.model';
import { ApiService } from '../../../service/api.service';


@Injectable({ providedIn: 'root' })
export class TaskStore {

    private readonly tasksSignal = signal<Task[]>([]);

    readonly tasks = computed(() => this.tasksSignal());

    constructor(private api: ApiService) { }

    loadTasks() {
        this.api.getTasks().subscribe((tasks) => this.tasksSignal.set(tasks));
    }

    addTask(task: Task) {
        this.api.createTask(task).subscribe((newTask) =>
            this.tasksSignal.update((tasks) => [...tasks, newTask])
        );
    }

    updateTask(id: number, updated: Task) {
        this.api.updateTask(id, updated).subscribe(() => this.loadTasks());
    }

    deleteTask(id: number) {
        this.api.deleteTask(id).subscribe(() =>
            this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id))
        );
    }

    filterTasks(filters: any) {
        this.api.getFilteredTasks(filters).subscribe((tasks) => this.tasksSignal.set(tasks));
    }
}
