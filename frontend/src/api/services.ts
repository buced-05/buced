import apiClient from './client'
import type {
  BudgetLine,
  EvaluationResult,
  Mentorship,
  Notification,
  OrientationRequest,
  PaginatedResponse,
  Project,
  ProjectsStatistics,
  PrototypeSprint,
  Recommendation,
  Resource,
  SentimentAnalysisResult,
  SponsorProfile,
  Vote,
} from '../types/api'

export interface ListParams {
  page?: number
  pageSize?: number
  ordering?: string
  search?: string
  filters?: Record<string, string | number | undefined>
}

const mapParams = ({ page, pageSize, ordering, search, filters = {} }: ListParams = {}) => {
  const params: Record<string, string | number> = {}
  if (page) params.page = page
  if (pageSize) params.page_size = pageSize
  if (ordering) params.ordering = ordering
  if (search) params.search = search
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params[key] = value
  })
  return params
}

export const projectsService = {
  list: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Project>>('/projects/items/', {
      params: mapParams(params),
    })
    return data
  },
  retrieve: async (id: number | string) => {
    const { data } = await apiClient.get<Project>(`/projects/items/${id}/`)
    return data
  },
  statistics: async () => {
    const { data } = await apiClient.get<ProjectsStatistics>('/projects/items/statistics/')
    return data
  },
  topSelection: async () => {
    const { data } = await apiClient.get<Project[]>('/projects/items/top-selection/')
    return data
  },
  assignTeam: async (id: number, teamIds: number[]) => {
    const { data } = await apiClient.post<Project>(`/projects/items/${id}/assign-team/`, {
      team_ids: teamIds,
    })
    return data
  },
}

export const votesService = {
  list: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Vote>>('/votes/community/', {
      params: mapParams(params),
    })
    return data
  },
  submit: async (payload: { project: number; rating: number; comment: string }) => {
    const { data } = await apiClient.post<Vote>('/votes/community/', payload)
    return data
  },
  evaluation: async (projectId: number) => {
    const { data } = await apiClient.get<EvaluationResult>(`/votes/evaluations/${projectId}/`)
    return data
  },
}

export const mlService = {
  sentiments: async (projectId: number) => {
    const { data } = await apiClient.get<PaginatedResponse<SentimentAnalysisResult>>('/ml/sentiment/', {
      params: { project: projectId },
    })
    return data
  },
  runSentiment: async (projectId: number) => {
    await apiClient.post('/ml/sentiment/run/', { project_id: projectId })
  },
  recommendations: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Recommendation>>('/ml/recommendations/')
    return data
  },
  refreshRecommendations: async () => {
    await apiClient.post('/ml/recommendations/refresh/', {})
  },
}

export const orientationService = {
  listRequests: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<OrientationRequest>>('/orientation/requests/', {
      params: mapParams(params),
    })
    return data
  },
  createRequest: async (payload: Pick<OrientationRequest, 'topic' | 'context'>) => {
    const { data } = await apiClient.post<OrientationRequest>('/orientation/requests/', payload)
    return data
  },
  listResources: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Resource>>('/orientation/resources/')
    return data
  },
}

export const prototypingService = {
  listSprints: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<PrototypeSprint>>('/prototyping/sprints/', {
      params: mapParams(params),
    })
    return data
  },
}

export const sponsorsService = {
  profiles: async () => {
    const { data } = await apiClient.get<PaginatedResponse<SponsorProfile>>('/sponsors/profiles/')
    return data
  },
}

export const accompagnementService = {
  mentorships: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Mentorship>>('/accompagnement/mentorships/', {
      params: mapParams(params),
    })
    return data
  },
}

export const notificationsService = {
  list: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>('/notifications/')
    return data
  },
}

export const budgetService = {
  lines: async (mentorshipId: number) => {
    const { data } = await apiClient.get<PaginatedResponse<BudgetLine>>('/accompagnement/budgets/', {
      params: { mentorship: mentorshipId },
    })
    return data
  },
}
