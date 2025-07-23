import TaskDetailPage from "@/components/TaskDetailPage"
import { PageProps } from "@/models/types"

export default async function TaskPage({ params }: PageProps) {
  await params;
  return <TaskDetailPage taskId={params.id} />
}
