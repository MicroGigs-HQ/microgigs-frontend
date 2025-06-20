"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useConnect } from "wagmi";
import {
  ArrowLeft,
  Home,
  Bell,
  Plus,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useCreateTask } from "@/hooks/useCreateTask";
import GigSuccessModal from "./GigSuccessModal";
import MobileHeader from "@/components/ui/MobileHeader";

interface CreateTaskFormData {
  taskTitle: string;
  price: string;
  category: string;
  gigDescription: string;
  deadline: string;
}

const CreateTask: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(
    null
  );

  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const sendNotification = useNotification();

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const factoryAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const {
    createTask,
    isPendingCreate,
    isConfirmingCreate,
    isSuccessCreate,
    txHash,
  } = useCreateTask(factoryAddress, (address as `0x${string}`) || undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateTaskFormData>();

  const isFarcasterFrame = context?.client?.clientFid !== undefined;
  const isEmbedded = typeof window !== "undefined" && window !== window.parent;

  useEffect(() => {
    setIsMounted(true);
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  // Fixed success handling effect
  useEffect(() => {
    if (isSuccessCreate && txHash && txHash !== lastTransactionHash) {
      console.log("Task created successfully!", { txHash });

      // Update last transaction hash first
      setLastTransactionHash(txHash);

      // Reset submitting state
      setIsSubmitting(false);

      // Show success toast
      toast.success("Task created successfully! 🎉", {
        duration: 4000,
        position: "top-center",
      });

      // Reset form
      reset();

      // Show success modal
      setShowSuccessModal(true);

      // Send notification (with error handling)
      try {
        sendNotification({
          title: "Task Created Successfully! 🎉",
          body: "Your task has been posted and is now visible to workers.",
        });
      } catch (notificationError) {
        console.log("Notification failed:", notificationError);
      }
    }
  }, [isSuccessCreate, txHash, lastTransactionHash, sendNotification, reset]);

  // Separate effect for handling pending states and timeouts
  useEffect(() => {
    if (isPendingCreate) {
      console.log("Transaction pending...");
    } else if (isConfirmingCreate) {
      console.log("Transaction confirming...");
    }
  }, [isPendingCreate, isConfirmingCreate]);

  // Timeout effect - only runs when submitting but not pending/confirming
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (
      isSubmitting &&
      !isPendingCreate &&
      !isConfirmingCreate &&
      !isSuccessCreate
    ) {
      timeoutId = setTimeout(() => {
        console.log("Transaction may have failed or timed out");
        setIsSubmitting(false);
        toast.error("Transaction failed or timed out. Please try again.");
      }, 30000); // Increased timeout to 30 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSubmitting, isPendingCreate, isConfirmingCreate, isSuccessCreate]);

  const onSubmit = async (data: CreateTaskFormData) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Validate all fields
    if (
      !data.taskTitle.trim() ||
      !data.price.trim() ||
      !data.category.trim() ||
      !data.gigDescription.trim() ||
      !data.deadline.trim()
    ) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse and validate price
      const rewardEth = data.price.replace(/[^0-9.]/g, "");
      if (
        !rewardEth ||
        isNaN(parseFloat(rewardEth)) ||
        parseFloat(rewardEth) <= 0
      ) {
        toast.error("Please enter a valid price in ETH (e.g., 0.01)");
        setIsSubmitting(false);
        return;
      }

      // Parse and validate deadline
      const deadlineInDays = parseInt(data.deadline.replace(/[^0-9]/g, ""));
      if (!deadlineInDays || deadlineInDays <= 0) {
        toast.error("Please enter a valid deadline in days (e.g., 7)");
        setIsSubmitting(false);
        return;
      }

      const deadlineInSeconds = deadlineInDays * 86400;

      console.log("Creating task with data:", {
        title: data.taskTitle.trim(),
        description: data.gigDescription.trim(),
        category: data.category,
        rewardInEth: rewardEth,
        deadlineInSeconds,
      });

      // Create task
      await createTask({
        title: data.taskTitle.trim(),
        description: data.gigDescription.trim(),
        category: data.category,
        rewardInEth: rewardEth,
        deadlineInSeconds,
      });

      console.log("CreateTask function called successfully");
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error(
        "An error occurred while creating the task. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const onSaveForLater = () => {
    const formData = watch();
    console.log("Save for later clicked", formData);
    toast("Save for later functionality coming soon!");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    console.log("Success modal closed");
  };

  const handleViewGig = () => {
    console.log("View gig clicked");
    setShowSuccessModal(false);
    toast.success("Redirecting to view your gig...");
  };

  const handlePostAnother = () => {
    console.log("Post another gig clicked");
    setShowSuccessModal(false);
    toast.success("Ready to create another task!");
  };

  const handleConnectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    } else {
      toast.error("No wallet connectors available");
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
        <MobileHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = isPendingCreate || isConfirmingCreate || isSubmitting;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Content */}
        <div className="flex-1 px-4 py-6 bg-gray-50">
          {/* Back Button and Title */}
          <div className="flex items-center space-x-3 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Fill in the details to post a gig.
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                This post will be made public, workers can see and apply for it.
              </p>
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              {(isFarcasterFrame || isEmbedded) && isConnected ? (
                <div className="relative w-fit shrink-0 mini-app-theme-dark z-10">
                  <div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)] ock-border-radius ock-text-foreground px-4 py-3 rounded-lg border border-gray-300"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="ock-font-family font-semibold ock-text-foreground text-inherit">
                              {address
                                ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Wallet className="z-10">
                  <ConnectWallet>
                    <div className="bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                      <Name className="text-inherit" />
                    </div>
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              )}
            </div>
          </div>

          {/* Show form only when connected */}
          {isConnected ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Task Title */}
              <div>
                <label
                  htmlFor="taskTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Task Title
                </label>
                <input
                  id="taskTitle"
                  type="text"
                  {...register("taskTitle", {
                    required: "Task title is required",
                    minLength: {
                      value: 3,
                      message: "Task title must be at least 3 characters",
                    },
                  })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter task title"
                  disabled={isProcessing}
                />
                {errors.taskTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.taskTitle.message}
                  </p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price (ETH)
                  </label>
                  <input
                    id="price"
                    type="text"
                    {...register("price", {
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9]*\.?[0-9]+$/,
                        message: "Please enter a valid number",
                      },
                    })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0.01"
                    disabled={isProcessing}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    disabled={isProcessing}
                  >
                    <option value="">Select category</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="content">Content</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gig Description */}
              <div>
                <label
                  htmlFor="gigDescription"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gig Description
                </label>
                <textarea
                  id="gigDescription"
                  {...register("gigDescription", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                  rows={6}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Describe your gig in detail..."
                  disabled={isProcessing}
                />
                {errors.gigDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gigDescription.message}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Deadline (in days)
                </label>
                <input
                  id="deadline"
                  type="text"
                  {...register("deadline", {
                    required: "Deadline is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter a valid number of days",
                    },
                  })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 7"
                  disabled={isProcessing}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#FF3C02] to-[#FF6D47] text-white py-4 rounded-lg font-medium text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPendingCreate
                    ? "Waiting for Wallet..."
                    : isConfirmingCreate
                      ? "Confirming Transaction..."
                      : isSubmitting
                        ? "Creating Task..."
                        : "Create & Fund Gig"}
                </button>
                <button
                  type="button"
                  onClick={onSaveForLater}
                  disabled={isProcessing}
                  className="w-full bg-white text-gray-700 py-4 rounded-lg font-medium text-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save for later
                </button>
              </div>

              {/* Transaction Status */}
              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        {isPendingCreate &&
                          "Please confirm the transaction in your wallet..."}
                        {isConfirmingCreate &&
                          "Transaction is being confirmed on the blockchain..."}
                        {isSubmitting &&
                          !isPendingCreate &&
                          !isConfirmingCreate &&
                          "Processing your request..."}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        This may take a few moments. Please don't close this
                        page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Connect Wallet Prompt */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-500 mb-6">
                Connect your wallet to create and fund tasks on the blockchain.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button className="flex flex-col items-center space-y-1 p-2">
              <Home className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Home</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Notification</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <div className="w-5 h-5 bg-[#FF3C02] rounded-full flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-[#FF3C02] font-medium">
                Create Task
              </span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">Chat</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">More</span>
            </button>
          </div>
        </div>

        {/* Success Modal */}
        <GigSuccessModal
          isOpen={true}
          onClose={handleCloseModal}
          onViewGig={handleViewGig}
          onPostAnother={handlePostAnother}
        />
      </div>
    </>
  );
};

export default CreateTask;
