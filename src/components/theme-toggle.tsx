import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const iconTransition =
  "size-4 transition-[transform,opacity] duration-200 ease-out"

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

  const label =
    theme === "system" ? "System theme" : theme === "dark" ? "Dark" : "Light"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative"
      aria-label={`Theme: ${label}. Change theme`}
      title={`Theme: ${label}`}
    >
      <Sun
        className={cn(
          iconTransition,
          theme === "light"
            ? "scale-100 rotate-0 text-warning"
            : "absolute scale-0 rotate-90"
        )}
      />
      <Moon
        className={cn(
          iconTransition,
          theme === "dark"
            ? "scale-100 rotate-0 text-primary"
            : "absolute scale-0 -rotate-90"
        )}
      />
      <Monitor
        className={cn(
          iconTransition,
          theme === "system"
            ? "scale-100 rotate-0 text-ink-2"
            : "absolute scale-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
