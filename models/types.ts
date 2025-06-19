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
