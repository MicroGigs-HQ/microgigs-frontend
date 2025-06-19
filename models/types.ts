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

export interface CreateGigData {
  taskTitle: string;
  price: string;
  category: string;
  description: string;
  deadline: string;
}
