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
    const { data } = await apiClient.get<PaginatedResponse<Project>>('/v1/projects/items/', {
      params: mapParams(params),
    })
    return data
  },
  retrieve: async (id: number | string) => {
    const { data } = await apiClient.get<Project>(`/v1/projects/items/${id}/`)
    return data
  },
  create: async (projectData: Partial<Project>) => {
    const { data } = await apiClient.post<Project>('/v1/projects/items/', projectData)
    return data
  },
  statistics: async () => {
    const { data } = await apiClient.get<ProjectsStatistics>('/v1/projects/items/statistics/')
    return data
  },
  topSelection: async () => {
    const { data } = await apiClient.get<Project[]>('/v1/projects/items/top-selection/')
    return data
  },
  assignTeam: async (id: number, teamIds: number[]) => {
    const { data } = await apiClient.post<Project>(`/v1/projects/items/${id}/assign-team/`, {
      team_ids: teamIds,
    })
    return data
  },
}

export const votesService = {
  list: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Vote>>('/v1/votes/community/', {
      params: mapParams(params),
    })
    return data
  },
  submit: async (payload: { project: number; rating: number; comment: string }) => {
    const { data } = await apiClient.post<Vote>('/v1/votes/community/', payload)
    return data
  },
  delete: async (voteId: number) => {
    await apiClient.delete(`/v1/votes/community/${voteId}/`)
  },
  evaluation: async (projectId: number) => {
    const { data } = await apiClient.get<EvaluationResult>(`/v1/votes/evaluations/${projectId}/`)
    return data
  },
}

export const mlService = {
  sentiments: async (projectId: number) => {
    const { data } = await apiClient.get<PaginatedResponse<SentimentAnalysisResult>>('/v1/ml/sentiment/', {
      params: { project: projectId },
    })
    return data
  },
  runSentiment: async (projectId: number) => {
    await apiClient.post('/v1/ml/sentiment/run/', { project_id: projectId })
  },
  recommendations: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Recommendation>>('/v1/ml/recommendations/')
    return data
  },
  refreshRecommendations: async () => {
    await apiClient.post('/v1/ml/recommendations/refresh/', {})
  },
}

export const orientationService = {
  listRequests: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<OrientationRequest>>('/v1/orientation/requests/', {
      params: mapParams(params),
    })
    return data
  },
  createRequest: async (payload: Pick<OrientationRequest, 'topic' | 'context'>) => {
    const { data } = await apiClient.post<OrientationRequest>('/v1/orientation/requests/', payload)
    return data
  },
  listResources: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Resource>>('/v1/orientation/resources/')
    return data
  },
  createResource: async (payload: Pick<Resource, 'title' | 'category' | 'description' | 'url'>) => {
    const { data } = await apiClient.post<Resource>('/v1/orientation/resources/', payload)
    return data
  },
}

export const prototypingService = {
  listSprints: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<PrototypeSprint>>('/v1/prototyping/sprints/', {
      params: mapParams(params),
    })
    return data
  },
}

export const sponsorsService = {
  profiles: async () => {
    const { data } = await apiClient.get<PaginatedResponse<SponsorProfile>>('/v1/sponsors/profiles/')
    return data
  },
}

export const accompagnementService = {
  mentorships: async (params?: ListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Mentorship>>('/v1/accompagnement/mentorships/', {
      params: mapParams(params),
    })
    return data
  },
}

export const notificationsService = {
  list: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>('/v1/notifications/')
    return data
  },
}

export const budgetService = {
  lines: async (mentorshipId: number) => {
    const { data } = await apiClient.get<PaginatedResponse<BudgetLine>>('/v1/accompagnement/budgets/', {
      params: { mentorship: mentorshipId },
    })
    return data
  },
}
