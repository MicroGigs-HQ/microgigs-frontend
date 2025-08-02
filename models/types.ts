export interface Task {
  taskAddress: string;
  completer?: string;
  poster?: string;
  title: string;
  description: string;
  reward: number | bigint;
  category: string;
  deadline: number | bigint |string;
  status: string;
  submissionDetails?: string;
  posterRating?: number;
  tokenAddress: string;
  completed: boolean;
  disputed: boolean;
}

export interface CreateGigData {
  title: string;
  price: string;
  category: string;
  description: string;
  deadline: string;
}

export interface TaskDetailPageProps {
  taskId?: string
}

export interface PageProps {
  params: {
    id: string
  }
}

export interface ApplicationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  timeRemaining: string
  onViewGig: () => void
  onMessageOwner: () => void
}

export interface SubmitTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskAddress?: string
  title?: string
  placeholder?: string
  submitText?: string
  cancelText?: string
  maxLength?: number
}