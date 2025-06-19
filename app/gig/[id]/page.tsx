import TaskDetailPage from "@/components/TaskDetailPage"

interface PageProps {
  params: {
    id: string
  }
}

export default function TaskPage({ params }: PageProps) {
  return <TaskDetailPage taskId={params.id} />
}
