import { Injectable, signal, computed } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ApiService } from '../../../service/api.service';

@Injectable({ providedIn: 'root' })
export class ProjectStore {
    
    private readonly projectsSignal = signal<Project[]>([]);

    readonly projects = computed(() => this.projectsSignal());

    constructor(private api: ApiService) { }

    loadProjects(): void {
        this.api.getProjects().subscribe((projects) => this.projectsSignal.set(projects));
    }

    addProject(project: Project): void {
        this.api.createProject(project).subscribe((createdProject) => {
            const current = this.projectsSignal();
            this.projectsSignal.set([...current, createdProject]);
        });
    }

    updateProject(id: number, updatedData: Project): void {
        this.api.updateProject(id, updatedData).subscribe((updatedProject) => {
            const current = this.projectsSignal().map(project =>
                project.id === id ? updatedProject : project
            );
            this.projectsSignal.set(current);
        });
    }

    deleteProject(id: number): void {
        this.api.deleteProject(id).subscribe(() => {
            const current = this.projectsSignal().filter(project => project.id !== id);
            this.projectsSignal.set(current);
        });
    }
}
