import { useEffect, useState, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import { Address } from 'viem'
import TaskEscrowABI from '@/lib/abis/TaskEscrow.json'
import { Task } from '@/models/types'

export function useGetTask(taskAddress: Address) {
  const publicClient = usePublicClient()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTaskDetails = useCallback(async () => {
    if (!publicClient || !taskAddress) return

    setLoading(true)
    setError(null)

    try {
      const [title, poster, completer, reward, deadline, description, status, category] = await Promise.all([
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'title' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'taskPoster' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'taskCompleter' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'reward' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'deadline' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'description' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'status' }),
        publicClient.readContract({ address: taskAddress, abi: TaskEscrowABI, functionName: 'category' }),
      ])

      setTask({
        taskAddress,
        title: title as string,
        poster: poster as Address,
        completer: completer as Address,
        reward: reward as number,
        deadline: deadline as string,
        description: description as string,
        status: status as string,
        category: category as string,
      })
    } catch (err) {
      console.error('Error fetching task:', err)
      setError('Failed to fetch task details')
    } finally {
      setLoading(false)
    }
  }, [publicClient, taskAddress])

  useEffect(() => {
    fetchTaskDetails()
  }, [fetchTaskDetails])

  return {
    task,
    loading,
    error,
    refreshTask: fetchTaskDetails,
  }
}
