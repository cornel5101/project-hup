import { TaskStatus } from "./task-status"

export interface Task {
  id: string,
  title: string,
  description: string
  status: TaskStatus,
  projectId: number,
  createdAt: Date
}