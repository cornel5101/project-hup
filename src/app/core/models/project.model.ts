import { Task } from "./task.model";

export interface Project {
  id: string,
  name: string,
  description: string,
  status: string,
  priority: string,
  createdAt: string | null,
  tasks: Task[],
}