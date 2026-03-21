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
      className="relative size-9 rounded-xl hover:bg-muted/50"
    >
      <Sun
        className={cn(
          "size-5 transition-all duration-300",
          theme === "light"
            ? "rotate-0 scale-100 text-amber-500"
            : "rotate-90 scale-0 absolute"
        )}
      />
      <Moon
        className={cn(
          "size-5 transition-all duration-300",
          theme === "dark"
            ? "rotate-0 scale-100 text-blue-400"
            : "-rotate-90 scale-0 absolute"
        )}
      />
      <Monitor
        className={cn(
          "size-5 transition-all duration-300",
          theme === "system"
            ? "rotate-0 scale-100 text-primary"
            : "scale-0 absolute"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}