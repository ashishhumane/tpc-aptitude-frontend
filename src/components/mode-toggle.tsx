"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-3">
      <Sun className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-yellow-500"}`} />
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <Moon className={`h-5 w-5 ${theme === "dark" ? "text-white" : "text-gray-400"}`} />
    </div>
  )
}
