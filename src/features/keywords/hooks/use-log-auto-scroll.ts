import { useLayoutEffect, useRef, useState } from "react"

const BOTTOM_THRESHOLD = 32

export function useLogAutoScroll(lastLogId?: string) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [following, setFollowing] = useState(true)

  useLayoutEffect(() => {
    const element = scrollRef.current
    if (element && following) element.scrollTop = element.scrollHeight
  }, [lastLogId, following])

  function handleScroll() {
    const element = scrollRef.current
    if (!element) return
    const distance =
      element.scrollHeight - element.clientHeight - element.scrollTop
    setFollowing(distance <= BOTTOM_THRESHOLD)
  }

  return { scrollRef, handleScroll, following }
}
