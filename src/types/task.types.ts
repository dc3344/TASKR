export type Status = 'New' | 'Ongoing' | 'Closed' | 'Archive'

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export type AssigneeType = 'individual' | 'unit'

export interface Task {
  id: string
  title: string
  assigneeType: AssigneeType
  assigneeId: string
  status: Status
  priority: Priority
  notes: string
  createdAt: number
  updatedAt: number
}
