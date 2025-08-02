import { useEffect, useMemo, useState } from 'react'
import { usePublicClient, useReadContract } from 'wagmi'
import { Address } from 'viem'
import TaskFactoryABI from '@/lib/abis/TaskFactory.json'
import TaskEscrowABI from '@/lib/abis/TaskEscrow.json'
import {Task} from "@/models/types";
// Reuse your existing Task type

export function useGetUncompletedTasks(factoryAddress: Address) {
    const publicClient = usePublicClient()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const {
        data: taskAddresses,
        isError: isAddressError,
        isLoading: isAddressLoading,
        refetch
    } = useReadContract({
        address: factoryAddress,
        abi: TaskFactoryABI,
        functionName: 'getUncompletedTasks',
        query: { enabled: !!factoryAddress },
    } as const)

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!taskAddresses || !publicClient) return

            setLoading(true)
            setError(null)

            try {
                const uncompletedTasks = await Promise.all(
                    (taskAddresses as Address[]).map(async (taskAddress) => {
                        const taskInfo = await publicClient.readContract({
                            address: taskAddress,
                            abi: TaskEscrowABI,
                            functionName: 'getTaskInfo'
                        })

                        const [
                            owner,
                            assignee,
                            title,
                            description,
                            category,
                            tokenAddress,
                            reward,
                            deadline,
                            status,
                            completed,
                            disputed
                        ] = taskInfo as [Address, Address, string, string, string, Address, bigint, bigint, number, boolean, boolean]

                        return {
                            taskAddress,
                            owner,
                            assignee,
                            title,
                            description,
                            category,
                            tokenAddress,
                            reward,
                            deadline,
                            status,
                            completed,
                            disputed,
                        }
                    })
                )

                setTasks(uncompletedTasks as Task[])
            } catch (err) {
                console.error('Failed to fetch task details:', err)
                setError('Failed to fetch task details')
            } finally {
                setLoading(false)
            }
        }

        if (taskAddresses && !isAddressLoading) {
            fetchTaskDetails()
        }
    }, [taskAddresses, publicClient, isAddressLoading])

    const refresh = () => {
        refetch()
    }

    return {
        tasks,
        loading: loading || isAddressLoading,
        error: error || (isAddressError ? 'Failed to fetch task addresses' : null),
        taskCount: tasks.length,
        refresh
    }
}