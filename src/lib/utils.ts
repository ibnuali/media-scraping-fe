import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLastScraped(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`
  const date = new Date(utcStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffSeconds < 60) {
    return "just now"
  } else if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60)
    return `${mins} minute${mins !== 1 ? "s" : ""} ago`
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600)
    return `about ${hours} hour${hours !== 1 ? "s" : ""} ago`
  } else if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400)
    return `${days} day${days !== 1 ? "s" : ""} ago`
  } else if (diffSeconds < 2592000) {
    const weeks = Math.floor(diffSeconds / 604800)
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
  } else {
    const months = Math.floor(diffSeconds / 2592000)
    return `${months} month${months !== 1 ? "s" : ""} ago`
  }
}

export function formatLocalDateTime(dateStr: string): string {
  // Ensure UTC format
  const utcStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`
  const date = new Date(utcStr)

  // Format with user's local timezone
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }

  return date.toLocaleString(undefined, options)
}
