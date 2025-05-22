import { Component, ElementRef, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskStore } from '../../task/state/task.store';
import { UserStore } from '../../users/state/user.store';
import { Task } from '../../../models/task.model';
import { User } from '../../../models/user.model';
import { ProjectStore } from '../../project/state/project.store';
declare var bootstrap: any;

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent implements OnInit {

  @ViewChild('taskModal') projectModal!: ElementRef;

  taskForm!: FormGroup;
  filterForm!: FormGroup;

  taskStore = inject(TaskStore);
  userStore = inject(UserStore);
  projectStore = inject(ProjectStore);

  currentPage = signal(1);
  pageSize = 5;
  editingTaskId: number | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedUserId: [''],
      projectId: ['']
    });

    this.filterForm = this.fb.group({
      title: [''],
      assignedUserId: [''],
      status: [''],
      priority: [''],
      projectId: ['']
    });

    this.taskStore.loadTasks();
    this.userStore.loadUsers();
    this.projectStore.loadProjects();

    effect(() => {
      this.filteredTasks(); // Auto re-evaluate filters
      this.currentPage.set(1); // Reset to first page on filter
    });
  }

  onFilter() {
    this.taskStore.filterTasks(this.filterForm.value); // Backend filter
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const task = this.taskForm.value;

    if (this.editingTaskId) {
      this.taskStore.updateTask(this.editingTaskId, task);
      this.editingTaskId = null;
    } else {
      this.taskStore.addTask(task);
    }

    this.taskForm.reset();
  }

  onEdit(task: Task) {
    this.editingTaskId = task.id!;
    this.taskForm.patchValue(task);
    this.taskForm.get('startDate')?.setValue(new Date(task.startDate).toISOString().split('T')[0]);
    this.taskForm.get('dueDate')?.setValue(new Date(task.dueDate).toISOString().split('T')[0]);

    const modal = new bootstrap.Modal(this.projectModal.nativeElement);
    modal.show();
  }

  onDelete(id: any) {
    this.taskStore.deleteTask(id);
  }

  onCancelEdit() {
    this.editingTaskId = null;
    this.taskForm.reset();
  }

  // 🔁 Reactive task list
  get filteredTasks() {
    return computed(() => this.taskStore.tasks());
  }

  get paginatedTasks() {
    return computed(() => {
      const all = this.filteredTasks();
      const start = (this.currentPage() - 1) * this.pageSize;
      return all.slice(start, start + this.pageSize);
    });
  }

  get totalPages() {
    return computed(() => Math.ceil(this.filteredTasks().length / this.pageSize));
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getUserName(id: number): string {
    return this.userStore.users().find(u => u.id === id)?.name || 'Unknown';
  }

  getProjectName(id: number): string {
    return this.projectStore.projects().find(p => p.id === id)?.name || 'Unknown';
  }
}
