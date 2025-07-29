"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wallet } from "lucide-react"
import Header from "@/components/ui/header"
import { MobileNavLayout } from "@/components/layout/MobileNavLayout"
import { useMiniKit, useNotification } from "@coinbase/onchainkit/minikit"
import { useAccount, useConnect } from "wagmi"
import { useCreateTask, CreateTaskParams } from "@/hooks/useCreateTask"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CreateGigData } from "@/models/types"
import GigSuccessModal from "@/components/ui/GigSuccessModal"

const CATEGORIES = [
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "content", label: "Content" },
  { value: "marketing", label: "Marketing" },
  { value: "translation", label: "Translation" },
  { value: "other", label: "Other" }
]

export default function CreateGig() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const sendNotification = useNotification()

  const { setFrameReady, isFrameReady } = useMiniKit()
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
    contractAddress,
    isUsingProxy
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

  // Mount effect
  useEffect(() => {
    setIsMounted(true)
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [isFrameReady, setFrameReady])

  // Success handling
  useEffect(() => {
    if (isSuccessCreate && txHash) {
      console.log("Task created successfully!", { txHash })
      
      // Send notification
      sendNotification({
        title: "Task Created!",
        body: `Your task has been created successfully.`,
      })

      // Reset form and show success modal
      reset()
      setShowSuccessModal(true)
    }
  }, [isSuccessCreate, txHash, reset, sendNotification])

  // Error handling
  useEffect(() => {
    if (isErrorCreate && createError) {
      console.error("Task creation failed:", createError)
      // Error is already handled in the hook with toast
    }
  }, [isErrorCreate, createError])

  const onSubmit = async (data: CreateGigData) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      // Parse and validate price
      const rewardEth = data.price.replace(/[^0-9.]/g, "")
      if (!rewardEth || isNaN(parseFloat(rewardEth)) || parseFloat(rewardEth) <= 0) {
        toast.error("Please enter a valid price in ETH (e.g., 0.01)")
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

  const onSaveForLater = () => {
    const formData = watch()
    console.log("Save for later clicked", formData)
    // TODO: Implement save to localStorage or database
    toast("Save for later functionality coming soon!")
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
  }

  const handleViewGig = () => {
    setShowSuccessModal(false)
    // TODO: Navigate to specific gig page when you have the gig ID
    // router.push(`/gig/${gigId}`)
    toast.success("Redirecting to view your gig...")
  }

  const handlePostAnother = () => {
    setShowSuccessModal(false)
    toast.success("Ready to create another task!")
  }

  const handleConnectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] })
    } else {
      toast.error("No wallet connectors available")
    }
  }

  const isProcessing = isPendingCreate || isConfirmingCreate

  // Don't render until mounted (prevents hydration issues)
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Header />
      <MobileNavLayout>
        <main className="mx-auto">
          {/* Processing Status */}
          {isProcessing && (
            <div className="border border-mobile-primary rounded-lg p-4 m-2">
              <div className="flex items-center">
                <div className="border-zinc-600 border-t-orange-500 rounded-full animate-spin h-3 w-3 border-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isPendingCreate && "Please confirm the transaction in your wallet..."}
                    {isConfirmingCreate && "Transaction is being confirmed on the blockchain..."}
                  </p>
                  <p className="text-xs text-mobile-primary mt-1">
                    This may take a few moments. Please don't close this page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Connection Prompt */}
          {!isConnected && (
            <div className="border border-yellow-400 bg-yellow-50 rounded-lg p-4 m-2">
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

          <Card className="max-w-md mx-auto border-0 shadow-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <Link href="/" className="text-gray-900">
                  <ArrowLeft />
                </Link>
                <CardTitle className="text-xl text-gray-900">
                  Fill in the details to post a gig.
                </CardTitle>
                <p className="text-mobile-form-title text-xs md:text-sm">
                  This post will be made public, workers can see and apply for it
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Task Title */}
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-mobile-form-title ml-2">
                    Task Title
                  </Label>
                  <Input
                    placeholder="Describe your task briefly"
                    className="rounded-xl border-slate-300 text-slate-500 text-sm"
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
                    <p className="mt-1 ml-2 text-xs text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1">
                    <Label htmlFor="budget" className="text-mobile-form-title ml-2">
                      Price
                    </Label>
                    <div className="relative">
                      <Input
                        id="budget"
                        type="number"
                        step="0.001"
                        min="0.001"
                        placeholder="0.001 ETH"
                        className="rounded-xl border-slate-300 text-slate-500 text-sm"
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
                      <Wallet className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                    </div>
                    {errors.price && (
                      <p className="mt-1 ml-2 text-xs text-red-600">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-mobile-form-title ml-2">
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
                          <SelectTrigger className="rounded-xl border-slate-300 text-slate-500 text-sm">
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
                      <p className="mt-1 ml-2 text-xs text-red-600">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-mobile-form-title ml-2">
                    Gig Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your task here"
                    className="rounded-xl border-slate-300 text-slate-500 text-sm"
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
                    <p className="mt-1 ml-2 text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-mobile-form-title ml-2">
                    Deadline (days)
                  </Label>
                  <Input
                    id="deadline"
                    type="number"
                    min="1"
                    max="365"
                    placeholder="e.g., 7"
                    className="rounded-xl border-slate-300 text-slate-500 text-sm"
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
                    <p className="mt-1 ml-2 text-xs text-red-600">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] hover:bg-mobile-primary rounded-xl font-semibold text-md"
                  disabled={isProcessing || !isConnected || !isValid}
                >
                  {isPendingCreate
                    ? "Waiting for Wallet..."
                    : isConfirmingCreate
                      ? "Confirming Transaction..."
                      : "Create Gig"}
                </Button>
                <Button
                  type="button"
                  onClick={onSaveForLater}
                  className="w-full bg-white text-gray-600 border border-gray-600 hover:bg-gray-900 hover:text-white rounded-xl font-semibold text-md"
                  disabled={isProcessing}
                >
                  Save for later
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </MobileNavLayout>

      <GigSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onViewGig={handleViewGig}
        onPostAnother={handlePostAnother}
      />
    </div>
  )
}