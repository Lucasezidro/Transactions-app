import { api } from '../api-client'

interface UpdateJobRequest {
  jobName: string
  salary: number
  company: string
  jobStartedDate: Date
  jobEndDate?: Date | null
  isCurrentJob: boolean
  jobId: string
}

interface UpdateJobResponse {
  job: {
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
  }
}

export async function updateJob({
  jobName,
  salary,
  company,
  jobStartedDate,
  jobEndDate,
  isCurrentJob,
  jobId,
}: UpdateJobRequest): Promise<UpdateJobResponse> {
  const result = await api.put(`/update/job/${jobId}`, {
    jobName,
    salary,
    company,
    jobStartedDate,
    jobEndDate,
    isCurrentJob,
  })

  return result.data
}
