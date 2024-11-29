/* eslint-disable no-extra-boolean-cast */
'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import 'dayjs/locale/pt-br'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getJobs } from '@/services/jobs/get-jobs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { createJob } from '@/services/jobs/create-job'
import { updateJob } from '@/services/jobs/update-job'
import { toast } from 'sonner'

dayjs.locale('pt-br')

const jobSchema = z.object({
  jobName: z.string(),
  salary: z.coerce.number(),
  company: z.string(),
  jobStartedDate: z.coerce.date(),
  jobEndDate: z.coerce.date().nullable().optional(),
  isCurrentJob: z.boolean().default(false),
})

type JobFormData = z.infer<typeof jobSchema>

interface JobFormProps {
  userId: string
}

export function JobForm({ userId }: JobFormProps) {
  const { data: dataJobs } = useQuery({
    queryKey: [userId, 'jobs'],
    queryFn: () => getJobs(userId),
  })

  const currentJob = dataJobs?.jobs.find((job) => job)

  console.log(!!dataJobs?.jobs.find((job) => job.userId === userId))

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobName: currentJob?.jobName,
      company: currentJob?.company,
      isCurrentJob: currentJob?.isCurrentJob,
      salary: currentJob?.salary,
      jobEndDate: currentJob?.jobEndDate as Date,
      jobStartedDate: currentJob?.jobStartedDate as Date,
    },
  })

  const formErrors = form.formState.errors

  const { mutateAsync: createJobFn } = useMutation({
    mutationFn: createJob,
  })

  const { mutateAsync: updateJobFn } = useMutation({
    mutationFn: updateJob,
  })

  async function handleSubmitJob(data: JobFormData) {
    const { jobName, company, isCurrentJob, jobStartedDate, salary } = data

    if (!!currentJob?.id) {
      await updateJobFn({
        jobName: data.jobName || currentJob?.jobName,
        company: data.company || currentJob?.company,
        isCurrentJob: data.isCurrentJob || currentJob?.isCurrentJob,
        jobStartedDate: data.jobStartedDate || currentJob?.jobStartedDate,
        salary: data.salary || currentJob?.salary,
        jobEndDate: data.jobEndDate || currentJob?.jobEndDate || null,
        jobId: currentJob?.id ?? '',
      }).then(() => {
        toast.success('Emprego atualizado com sucesso!')
      })
    } else {
      await createJobFn({
        jobName,
        company,
        isCurrentJob,
        jobStartedDate,
        salary,
        jobEndDate: data.jobEndDate ?? null,
        userId,
      }).then(() => {
        toast.success('Emprego cadastrado com sucesso!')
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitJob)}
        className="flex flex-col gap-8 max-w-[680px] w-full"
      >
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-xl font-bold">Dados do emprego</h1>
          <span className="text-sm text-zinc-700 dark:text-zinc-400">
            {dataJobs?.jobs?.length === 0
              ? 'Ainda não há emprego cadastrado'
              : `Emprego cadastrado em ${dayjs(currentJob && currentJob?.createdAt).format('DD [de] MMMM [de] YYYY')}`}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-4 w-full">
            <Label className="dark:text-zinc-400 font-semibold">Cargo</Label>
            <Input
              defaultValue={currentJob?.jobName ?? ''}
              {...form.register('jobName')}
            />

            {formErrors.jobName && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {formErrors.jobName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Label className="dark:text-zinc-400 font-semibold">Empresa</Label>
            <Input
              defaultValue={currentJob?.company ?? ''}
              {...form.register('company')}
            />

            {formErrors.company && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {formErrors.company.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Label className="dark:text-zinc-400 font-semibold">Salário</Label>
            <Input
              defaultValue={currentJob?.salary ?? undefined}
              {...form.register('salary')}
            />

            {formErrors.salary && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {formErrors.salary.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-4 w-full">
            <FormField
              control={form.control}
              name="jobStartedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="mb-4 dark:text-zinc-400 font-semibold">
                    Data de início
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <span>
                            {!!currentJob?.id
                              ? field.value
                                ? dayjs(field.value).format(
                                    'DD [de] MMMM [de] YYYY',
                                  )
                                : 'Selecione uma data'
                              : dayjs(currentJob?.jobStartedDate).format(
                                  'DD [de] MMMM [de] YYYY',
                                )}
                          </span>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentJob?.jobStartedDate}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.jobStartedDate && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {formErrors.jobStartedDate.message}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <FormField
              control={form.control}
              name="jobEndDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="mb-4 dark:text-zinc-400 font-semibold">
                    Data de saída
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <span>
                            {!!currentJob?.id
                              ? field.value
                                ? dayjs(field.value).format(
                                    'DD [de] MMMM [de] YYYY',
                                  )
                                : 'Selecione uma data'
                              : dayjs(currentJob?.jobEndDate).format(
                                  'DD [de] MMMM [de] YYYY',
                                )}
                          </span>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={(currentJob?.jobEndDate as Date) ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="isCurrentJob"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={currentJob?.isCurrentJob}
                  onCheckedChange={field.onChange}
                  defaultChecked={currentJob?.isCurrentJob}
                />
              </FormControl>
              <FormLabel>Selecione se este for seu emprego atual</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Alterar dados do emprego</Button>
      </form>
    </Form>
  )
}
