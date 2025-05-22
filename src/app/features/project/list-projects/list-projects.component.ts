import { Component, ElementRef, OnInit, ViewChild, computed, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectStore } from '../state/project.store';
import { Project } from '../../../models/project.model';
declare var bootstrap: any;

@Component({
  selector: 'app-list-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  @ViewChild('projectModal') projectModal!: ElementRef;

  projectForm!: FormGroup;
  filterForm!: FormGroup;

  currentPage = signal(1);
  pageSize = 5;

  editingProjectId: number | null = null;

  constructor(private fb: FormBuilder, public projectStore: ProjectStore) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Todo', Validators.required],
      priority: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
      priority: ['']
    });

    this.projectStore.loadProjects();

    // Reset to page 1 when filters change
    effect(() => {
      this.filteredProjects();
      this.currentPage.set(1);
    });
  }

  onFilter() {
    // Just trigger the reactive filter recomputation
  }

  get filteredProjects() {
    return computed(() => {
      const projects = this.projectStore.projects();
      const { name, status, priority } = this.filterForm.value;

      return projects.filter(p =>
        (!name || p.name.toLowerCase().includes(name.toLowerCase())) &&
        (!status || p.status === status) &&
        (!priority || p.priority === priority)
      );
    });
  }

  get paginatedProjects() {
    return computed(() => {
      const all = this.filteredProjects();
      const start = (this.currentPage() - 1) * this.pageSize;
      const end = start + this.pageSize;
      return all.slice(start, end);
    });
  }

  get totalPages() {
    return computed(() => Math.ceil(this.filteredProjects().length / this.pageSize));
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formData = this.projectForm.value;

    if (this.editingProjectId) {
      this.projectStore.updateProject(this.editingProjectId, formData);
      this.editingProjectId = null;
    } else {
      this.projectStore.addProject(formData);
    }

    this.projectForm.reset();
  }

  onEdit(project: Project) {
    this.editingProjectId = project.id!;
    this.projectForm.patchValue(project);
    this.projectForm.get('startDate')?.setValue(new Date(project.startDate).toISOString().split('T')[0]);
    this.projectForm.get('endDate')?.setValue(new Date(project.endDate).toISOString().split('T')[0]);

    const modal = new bootstrap.Modal(this.projectModal.nativeElement);
    modal.show();
  }

  onDelete(id: any) {
    this.projectStore.deleteProject(id);
  }

  onCancelEdit() {
    this.editingProjectId = null;
    this.projectForm.reset();
  }
}
