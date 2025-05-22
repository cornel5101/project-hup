export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  startDate: string;
  status: string;
  priority: string;
  projectId: number;
  assignedUserId: number;
}
