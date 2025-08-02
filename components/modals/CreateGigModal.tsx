// components/modals/CreateGigModal.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Wallet, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useAccount, useConnect } from "wagmi"
import { useCreateTask, CreateTaskParams } from "@/hooks/useCreateTask"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-hot-toast"
import { SUPPORTED_TOKENS, SupportedTokenSymbol } from "@/lib/config/supported_tokens"
import abstract from "../../public/waving-orange.png"

interface CreateGigModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface CreateGigData {
  title: string
  price: string
  tokenSymbol: SupportedTokenSymbol
  category: string
  description: string
  deadline: string
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
    isErrorCreate,
    currentStep,
    isApproving,
    isCreating,
    isPendingApproval,
    isConfirmingApproval,
    isSuccessApproval,
    isPendingTaskCreation,
    isConfirmingTaskCreation,
    approvalTxHash,
    createTxHash,
    approvalError,
    createError,
    contractAddress,
    isUsingProxy,
    getSupportedTokens
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
      tokenSymbol: 'USDC', // Default to USDC
      category: '',
      description: '',
      deadline: ''
    }
  })

  const supportedTokens = getSupportedTokens()

  // Success handling
  useEffect(() => {
    if (isSuccessCreate && createTxHash) {
      console.log("Task created successfully!", { createTxHash })
      reset()
      setShowSuccessView(true)
      onSuccess?.()
    }
  }, [isSuccessCreate, createTxHash, reset, onSuccess])

  // Error handling
  useEffect(() => {
    if (isErrorCreate && (approvalError || createError)) {
      console.error("Task creation failed:", { approvalError, createError })
      // Error is already handled in the hook with toast
    }
  }, [isErrorCreate, approvalError, createError])

  const onSubmit = async (data: CreateGigData) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      // Parse and validate price
      const rewardAmount = data.price.replace(/[^0-9.]/g, "")
      if (!rewardAmount || isNaN(parseFloat(rewardAmount)) || parseFloat(rewardAmount) <= 0) {
        toast.error("Please enter a valid price (e.g., 100)")
        return
      }

      // Parse and validate deadline
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
        rewardAmount: rewardAmount,
        tokenSymbol: data.tokenSymbol,
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
  const selectedToken = watch('tokenSymbol')
  const selectedTokenInfo = SUPPORTED_TOKENS[selectedToken]

  // Render transaction status component
  const renderTransactionStatus = () => {
    if (!isProcessing) return null

    return (
        <div className="border border-orange-500 bg-orange-50 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            {/* Approval Step */}
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {isSuccessApproval ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isPendingApproval || isConfirmingApproval ? (
                    <div className="border-orange-600 border-t-orange-500 rounded-full animate-spin h-3 w-3 border-2"></div>
                ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-orange-900">
                  Approve {selectedTokenInfo?.symbol} spending
                </p>
                <p className="text-xs text-orange-700">
                  {isPendingApproval && "Confirm approval in wallet..."}
                  {isConfirmingApproval && "Approval confirming..."}
                  {isSuccessApproval && "Approved!"}
                  {!isApproving && !isSuccessApproval && "Waiting..."}
                </p>
              </div>
            </div>

            {/* Creation Step */}
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                {isSuccessCreate ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isPendingTaskCreation || isConfirmingTaskCreation ? (
                    <div className="border-orange-600 border-t-orange-500 rounded-full animate-spin h-3 w-3 border-2"></div>
                ) : isSuccessApproval ? (
                    <Clock className="h-4 w-4 text-blue-500" />
                ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-orange-900">
                  Create task
                </p>
                <p className="text-xs text-orange-700">
                  {isPendingTaskCreation && "Confirm creation in wallet..."}
                  {isConfirmingTaskCreation && "Creation confirming..."}
                  {isSuccessCreate && "Created successfully!"}
                  {!isCreating && !isSuccessCreate && isSuccessApproval && "Ready to create"}
                  {!isCreating && !isSuccessCreate && !isSuccessApproval && "Waiting for approval..."}
                </p>
              </div>
            </div>

            <div className="mt-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
              <p className="text-xs text-yellow-800">
                Two transactions required. Keep this modal open.
              </p>
            </div>
          </div>
        </div>
    )
  }

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

                {/* Transaction Status */}
                {renderTransactionStatus()}

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
                      <div className="relative">
                        <Input
                            type="number"
                            step="0.001"
                            min="0.001"
                            placeholder={`100 ${selectedTokenInfo?.symbol || ''}`}
                            className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 pr-12"
                            {...register("price", {
                              required: "Price is required",
                              pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Please enter a valid number",
                              },
                              min: {
                                value: 0.001,
                                message: "Minimum price is 0.01"
                              }
                            })}
                            disabled={isProcessing}
                        />
                        <div className="absolute right-2 top-[0.6rem] flex items-center">
                          {selectedTokenInfo?.logo && (
                              <Image
                                  src={selectedTokenInfo.logo}
                                  alt={selectedTokenInfo.symbol}
                                  width={20}
                                  height={20}
                                  className="mr-1"
                              />
                          )}
                      {/*    <span className="text-xs text-gray-500 font-medium">*/}
                      {/*  {selectedTokenInfo?.symbol}*/}
                      {/*</span>*/}
                        </div>
                      </div>
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

                  {/* Token Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="tokenSymbol" className="text-gray-600 text-sm">
                      Payment Token
                    </Label>
                    <Controller
                        name="tokenSymbol"
                        control={control}
                        rules={{ required: "Payment token is required" }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isProcessing}
                            >
                              <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                                <SelectValue placeholder="Select payment token">
                                  {field.value && (
                                      <div className="flex items-center">
                                        {SUPPORTED_TOKENS[field.value]?.logo && (
                                            <Image
                                                src={SUPPORTED_TOKENS[field.value].logo}
                                                alt={SUPPORTED_TOKENS[field.value].symbol}
                                                width={18}
                                                height={18}
                                                className="mr-2"
                                            />
                                        )}
                                        <span className="text-sm">{SUPPORTED_TOKENS[field.value]?.name}</span>
                                        <span className="ml-1 text-xs text-gray-500">
                                ({SUPPORTED_TOKENS[field.value]?.symbol})
                              </span>
                                      </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {supportedTokens.map((token) => (
                                    <SelectItem key={token.symbol} value={token.symbol}>
                                      <div className="flex items-center">
                                        {token.logo && (
                                            <Image
                                                src={token.logo}
                                                alt={token.symbol}
                                                width={18}
                                                height={18}
                                                className="mr-2"
                                            />
                                        )}
                                        <span>{token.name}</span>
                                        <span className="ml-1 text-xs text-gray-500">
                                ({token.symbol})
                              </span>
                                      </div>
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.tokenSymbol && (
                        <p className="text-xs text-red-600">{errors.tokenSymbol.message}</p>
                    )}
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
                    {isPendingApproval
                        ? "Waiting for Approval..."
                        : isConfirmingApproval
                            ? "Confirming Approval..."
                            : isPendingTaskCreation
                                ? "Waiting for Task Creation..."
                                : isConfirmingTaskCreation
                                    ? "Confirming Task Creation..."
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