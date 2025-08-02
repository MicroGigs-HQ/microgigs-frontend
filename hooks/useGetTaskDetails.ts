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
      // Use the getTaskInfo function which returns all task details in one call
      const taskInfo = await publicClient.readContract({
        address: taskAddress,
        abi: TaskEscrowABI,
        functionName: 'getTaskInfo'
      })

      // Destructure the returned tuple according to the ABI
      const [
        owner,
        assignee,
        taskTitle,
        taskDescription,
        taskCategory,
        token,
        rewardAmount,
        taskDeadline,
        taskStatus,
        completed,
        disputed
      ] = taskInfo as [Address, Address, string, string, string, Address, bigint, bigint, number, boolean, boolean]

      setTask({
        taskAddress,
        title: taskTitle,
        poster: owner,
        completer: assignee,
        reward: Number(rewardAmount),
        deadline: taskDeadline.toString(),
        description: taskDescription,
        status: taskStatus.toString(),
        category: taskCategory,
        tokenAddress: token,
        completed: completed,
        disputed: disputed
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