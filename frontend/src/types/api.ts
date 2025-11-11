export type UserRole = 'student' | 'advisor' | 'admin' | 'sponsor' | 'jury'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  establishment?: string
  avatar?: string
  date_joined: string
}

export interface ProjectDocument {
  id: number
  project: number
  file_name: string
  file_url: string
  file_type: string
  uploaded_at: string
}

export interface Project {
  id: number
  title: string
  description: string
  category: string
  status: string
  owner: User
  team: User[]
  objectives?: string
  expected_impact?: string
  required_resources?: string
  community_score: number
  ai_score: number
  final_score: number
  progress: Record<string, unknown>
  documents: ProjectDocument[]
  created_at: string
  updated_at: string
}

export interface Vote {
  id: number
  voter: number
  voter_display: string
  project: number
  rating: number
  comment: string
  sentiment: string
  created_at: string
}

export interface EvaluationResult {
  project: number
  feasibility: number
  innovation: number
  impact: number
  clarity: number
  ai_score: number
  updated_at: string
}

export interface SentimentAnalysisResult {
  id: number
  project: number
  comment_id: number
  sentiment: string
  confidence: number
  analyzed_at: string
}

export interface Recommendation {
  id: number
  project: number
  user: number
  score: number
  created_at: string
}

export interface OrientationRequest {
  id: number
  student: number
  student_name: string
  advisor: number | null
  advisor_name: string | null
  topic: string
  context: string
  status: string
  created_at: string
  updated_at: string
}

export interface OrientationMessage {
  id: number
  conversation: number
  author: number
  author_name: string
  content: string
  created_at: string
}

export interface Resource {
  id: number
  title: string
  description: string
  category: string
  url: string
  created_at: string
}

export interface PrototypeSprint {
  id: number
  project: number
  start_date: string
  end_date: string | null
  specification: string
  status: string
  squad: number[]
  squad_detail: User[]
  tasks: KanbanTask[]
}

export interface KanbanTask {
  id: number
  sprint: number
  title: string
  description: string
  assignee: number | null
  assignee_detail: User | null
  status: string
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface SponsorProfile {
  id: number
  user: User
  company: string
  interests: string[]
  total_budget: string
  description: string
  sponsorships: Sponsorship[]
}

export interface Sponsorship {
  id: number
  sponsor: number
  project: number
  amount: string
  type: string
  created_at: string
  messages: SponsorMessage[]
}

export interface SponsorMessage {
  id: number
  sponsorship: number
  author: number
  author_detail: User
  content: string
  created_at: string
}

export interface Mentorship {
  id: number
  project: number
  mentor: number | null
  kpis: Record<string, unknown>
  budget_allocated: string
  notes: string
  milestones: Milestone[]
  budget_lines: BudgetLine[]
}

export interface Milestone {
  id: number
  mentorship: number
  title: string
  description: string
  due_date: string
  is_completed: boolean
  progress: number
}

export interface BudgetLine {
  id: number
  mentorship: number
  label: string
  amount: string
  spent: string
  created_at: string
}

export interface Notification {
  id: number
  recipient: number
  title: string
  message: string
  url: string
  is_read: boolean
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ProjectsStatistics {
  total: number
  by_category: Array<{
    category: string
    count: number
  }>
  avg_final_score: number
  avg_ai_score: number
  avg_community_score: number
}
