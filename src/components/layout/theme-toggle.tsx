"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"


export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { state: sidebarState } = useSidebar() 

  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const Icon = isDarkMode ? Sun : Moon;
  const label = isDarkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap";

  if (sidebarState === "collapsed") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={label} className="w-full">
            <Icon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start gap-2 px-2">
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  )
}
