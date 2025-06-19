"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wallet } from "lucide-react"
import Header from "@/components/ui/header";
import {MobileNavLayout} from "@/components/layout/MobileNavLayout";

export default function CreateGig() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect would happen here
    }, 2000)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header/>
      {/*<MobileBottomNav/>*/}
      <MobileNavLayout>
        <main className=" mx-auto">
          <Card className="max-w-md mx-auto border-0 shadow-0">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <Link href="/" className="text-gray-900">
                  <ArrowLeft />
                </Link>
                <CardTitle className="text-xl text-gray-900">Fill in the details to post a gig.</CardTitle>
                <p className="text-mobile-form-title text-xs md:text-sm">this post will be made public, workers can see and apply for it</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-mobile-form-title ml-2">Task Title</Label>
                  <Input id="title" placeholder="Describe your task briefly" className="rounded-xl border-slate-300 text-slate-500 text-sm" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="budget" className="text-mobile-form-title ml-2">Price</Label>
                    <div className="relative">
                      <Input id="budget" type="number" step="0.001" min="0.001" placeholder="0.001 ETH" className="rounded-xl border-slate-300 text-slate-500 text-sm" required />
                      <Wallet className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-mobile-form-title ml-2">Category</Label>
                    <Select required>
                      <SelectTrigger id="category" className="rounded-xl border-slate-300 text-slate-500 text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="translation">Translation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-mobile-form-title ml-2">Gig Description</Label>
                  <Textarea
                      id="description"
                      placeholder="Describe your task here"
                      className="rounded-xl border-slate-300 text-slate-500 text-sm"
                      rows={2}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-mobile-form-title ml-2">Deadline</Label>
                  <input type="date" className="h-10 rounded-xl border-slate-300 text-slate-500 w-full border px-3 py-2 text-sm" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button type="submit" className="w-full bg-mobile-primary hover:bg-mobile-primary rounded-xl font-semibold text-md" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Gigs"}
                </Button>
                <Button type="submit" className="w-full bg-white text-gray-600 border border-gray-600 hover:bg-mobile-primary rounded-xl font-semibold text-md" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save for later"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </MobileNavLayout>
    </div>
  )
}
