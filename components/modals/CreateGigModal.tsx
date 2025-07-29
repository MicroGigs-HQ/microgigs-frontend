// components/modals/CreateGigModal.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Wallet } from "lucide-react"
import Image from "next/image"
import { useAccount, useConnect } from "wagmi"
import { useCreateTask, CreateTaskParams } from "@/hooks/useCreateTask"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CreateGigData } from "@/models/types"
import abstract from "../../public/waving-orange.png"

interface CreateGigModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CATEGORIES = [
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "content", label: "Content" },
  { value: "marketing", label: "Marketing" },
  { value: "translation", label: "Translation" },
  { value: "other", label: "Other" }
]

export default function CreateGigModal({ isOpen, onClose, onSuccess }: CreateGigModalProps) {
  const [showSuccessView, setShowSuccessView] = useState(false)
  
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  const { 
    createTask, 
    isPendingCreate, 
    isConfirmingCreate, 
    isSuccessCreate, 
    txHash, 
    isErrorCreate, 
    createError,
  } = useCreateTask(address)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreateGigData>({
    mode: "onChange",
    defaultValues: {
      title: '',
      price: '',
      category: '',
      description: '',
      deadline: ''
    }
  })

  // Success handling
  useEffect(() => {
    if (isSuccessCreate && txHash) {
      console.log("Task created successfully!", { txHash })
      reset()
      setShowSuccessView(true)
      onSuccess?.()
    }
  }, [isSuccessCreate, txHash, reset, onSuccess])

  const onSubmit = async (data: CreateGigData) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      const rewardEth = data.price.replace(/[^0-9.]/g, "")
      if (!rewardEth || isNaN(parseFloat(rewardEth)) || parseFloat(rewardEth) <= 0) {
        toast.error("Please enter a valid price in ETH (e.g., 0.01)")
        return
      }

      const deadlineInDays = parseInt(data.deadline.replace(/[^0-9]/g, ""))
      if (!deadlineInDays || deadlineInDays <= 0) {
        toast.error("Please enter a valid deadline in days (e.g., 7)")
        return
      }

      const deadlineInSeconds = deadlineInDays * 86400

      const taskParams: CreateTaskParams = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        rewardInEth: rewardEth,
        deadlineInSeconds,
      }

      console.log("Creating task with params:", taskParams)
      await createTask(taskParams)
    } catch (err) {
      console.error("Error in form submission:", err)
      toast.error("An error occurred while creating the task. Please try again.")
    }
  }

  const handleClose = () => {
    reset()
    setShowSuccessView(false)
    onClose()
  }

  const handleConnectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] })
    } else {
      toast.error("No wallet connectors available")
    }
  }

  const isProcessing = isPendingCreate || isConfirmingCreate

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-32 overflow-hidden">
          <Image
            src={abstract}
            alt="Abstract illustration"
            fill
            className="object-cover"
          />
        </div>

        {showSuccessView ? (
          // Success View
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gig Successfully Posted</h3>
              <p className="text-sm text-gray-500">This post will be made public, workers can see and apply for it.</p>
            </div>

            <div className="space-y-3">
              <button
                className="w-full px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                }}
                onClick={handleClose}
              >
                View Gig
              </button>
              
              <button
                onClick={() => {
                  setShowSuccessView(false)
                  reset()
                }}
                className="w-full px-6 py-3 rounded-xl bg-white text-gray-600 border border-gray-600 hover:bg-gray-900 hover:text-white font-medium transition-colors"
              >
                Post another Gig
              </button>
            </div>
          </div>
        ) : (
          // Create Form View
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fill in the details to post a gig.</h3>
              <p className="text-sm text-gray-500">This post will be made public, workers can see and apply for it</p>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="border border-orange-500 bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="border-orange-600 border-t-orange-500 rounded-full animate-spin h-4 w-4 border-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      {isPendingCreate && "Please confirm the transaction in your wallet..."}
                      {isConfirmingCreate && "Transaction is being confirmed on the blockchain..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Connection Prompt */}
            {!isConnected && (
              <div className="border border-yellow-400 bg-yellow-50 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 text-yellow-600 mr-2" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                      Please connect your wallet to create a gig
                    </p>
                  </div>
                  <Button
                    onClick={handleConnectWallet}
                    size="sm"
                    variant="outline"
                    className="ml-2"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Task Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-600 text-sm">
                  Task Title
                </Label>
                <Input
                  placeholder="Describe your task briefly"
                  className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                  {...register("title", {
                    required: "Task title is required",
                    minLength: {
                      value: 3,
                      message: "Task title must be at least 3 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Task title must be less than 100 characters",
                    },
                  })}
                  disabled={isProcessing}
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-600 text-sm">
                    Price
                  </Label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="0.001 ETH"
                    className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                    {...register("price", {
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9]*\.?[0-9]+$/,
                        message: "Please enter a valid number",
                      },
                      min: {
                        value: 0.001,
                        message: "Minimum price is 0.001 ETH"
                      }
                    })}
                    disabled={isProcessing}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-600 text-sm">
                    Category
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isProcessing}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-600 text-sm">
                  Gig Description
                </Label>
                <Textarea
                  placeholder="Describe your task here"
                  className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                  rows={3}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Description must be less than 500 characters",
                    },
                  })}
                  disabled={isProcessing}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-gray-600 text-sm">
                  Deadline (days)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  placeholder="e.g., 7"
                  className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                  {...register("deadline", {
                    required: "Deadline is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter a valid number of days",
                    },
                    min: {
                      value: 1,
                      message: "Deadline must be at least 1 day"
                    },
                    max: {
                      value: 365,
                      message: "Deadline cannot exceed 365 days"
                    }
                  })}
                  disabled={isProcessing}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-600">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(to bottom, #FF6D47, #FF3C02)'
                }}
                disabled={isProcessing || !isConnected || !isValid}
              >
                {isPendingCreate
                  ? "Waiting for Wallet..."
                  : isConfirmingCreate
                    ? "Confirming Transaction..."
                    : "Create Gig"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // Save for later functionality
                  const formData = watch()
                  console.log("Save for later:", formData)
                  toast("Save for later functionality coming soon!")
                }}
                className="w-full px-6 py-3 rounded-xl bg-white text-gray-600 border border-gray-600 hover:bg-gray-900 hover:text-white font-medium transition-colors"
                disabled={isProcessing}
              >
                Save for later
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}