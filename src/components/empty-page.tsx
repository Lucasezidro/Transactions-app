import { CircleOff } from 'lucide-react'

interface EmptyPageProps {
  title: string
}

export function EmptyPage({ title }: EmptyPageProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-muted-foreground text-xl">{title}</h1>

      <CircleOff className="size-8 text-muted-foreground" />
    </div>
  )
}
