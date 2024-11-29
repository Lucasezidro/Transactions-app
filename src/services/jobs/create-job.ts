import { api } from '../api-client'

interface CreateJobRequest {
  jobName: string
  salary: number
  company: string
  jobStartedDate: Date
  jobEndDate?: Date | null
  isCurrentJob: boolean
  userId: string
}

interface CreateJobResponse {
  job: {
    userId: string
    id: string
    createdAt: Date
    updatedAt: Date
    jobName: string
    company: string
    isCurrentJob: boolean
    salary: number
    jobEndDate?: Date | null
    jobStartedDate: Date
  }
}

export async function createJob({
  jobName,
  salary,
  company,
  jobStartedDate,
  jobEndDate,
  isCurrentJob,
  userId,
}: CreateJobRequest): Promise<CreateJobResponse> {
  const result = await api.post(`/create/job/${userId}`, {
    jobName,
    salary,
    company,
    jobStartedDate,
    jobEndDate,
    isCurrentJob,
  })

  return result.data
}
