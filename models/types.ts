export interface Task {
  taskAddress: string;
  completer?: string;
  poster?: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  deadline: string;
  status: string;
  submissionDetails?: string;
  posterRating?: number;
}

export interface TaskDetailPageProps {
  taskId?: string
}

// export interface Task {
//   taskAddress: Address
//   poster: Address
//   completer: Address
//   reward: bigint
//   deadline: bigint
//   title: string
//   description: string
//   status: number
//   category?: string
//   submissionDetails?: string
// }