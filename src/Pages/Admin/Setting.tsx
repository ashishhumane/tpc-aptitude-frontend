"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const Setting = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMakeAdmin = async () => {
    if (!email) {
      toast.error("Please enter an email.") // Error message
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/auth/update-admin-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          isAdmin: true,
          securityKey: "TPC-PCE",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to make admin.")
      }

      toast.success(`${email} is now an admin.`) // Success message
      setEmail("") // Reset input after success
    } catch (error) {
      toast.error((error as Error).message || "Failed to make admin.") // Error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full h-48 lg:ml-10 mt-24 max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Make User Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleMakeAdmin} disabled={loading}>
            {loading ? "Processing..." : "Make Admin"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Setting
