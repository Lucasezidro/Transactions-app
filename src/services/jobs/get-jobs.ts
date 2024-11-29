import { api } from '../api-client'

interface GetJobsResponse {
  jobs: {
    userId: string
    id: string
    createdAt: Date
    updatedAt: Date
    jobName: string
    company: string
    isCurrentJob: boolean
    salary: number
    jobEndDate: Date | null
    jobStartedDate: Date
  }[]
}

export async function getJobs(userId: string): Promise<GetJobsResponse> {
  const result = await api.get(`/fetch/jobs/${userId}`)

  return result.data
}
