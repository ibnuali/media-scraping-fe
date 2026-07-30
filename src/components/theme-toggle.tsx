import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative size-8 rounded-md hover:bg-muted"
    >
      <Sun
        className={cn(
          "size-4 transition-all duration-200",
          theme === "light"
            ? "scale-100 rotate-0 text-amber-500"
            : "absolute scale-0 rotate-90"
        )}
      />
      <Moon
        className={cn(
          "size-4 transition-all duration-200",
          theme === "dark"
            ? "scale-100 rotate-0 text-blue-400"
            : "absolute scale-0 -rotate-90"
        )}
      />
      <Monitor
        className={cn(
          "size-4 transition-all duration-200",
          theme === "system"
            ? "scale-100 rotate-0 text-primary"
            : "absolute scale-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
