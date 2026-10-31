import type { ComponentProps, ReactNode } from "react"
import { Input } from "@/components/ui/input"
export type ResearchFieldProps = ComponentProps<typeof Input> & {
  label: string
}
export type ResearchSelectProps = ComponentProps<"select"> & {
  label: string
  options: readonly string[]
}
export type ResearchTextProps = ComponentProps<"textarea"> & { label: string }
export type ResearchCheckProps = ComponentProps<"input"> & {
  children: ReactNode
}

export function ResearchField({ label, ...props }: ResearchFieldProps) {
  return (
    <label className="block text-xs">
      {label}
      <Input className="mt-1" {...props} />
    </label>
  )
}
export function ResearchSelect({
  label,
  options,
  ...props
}: ComponentProps<"select"> & { label: string; options: readonly string[] }) {
  return (
    <label className="block text-xs">
      {label}
      <select
        className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-sm"
        {...props}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  )
}
export function ResearchText({ label, ...props }: ResearchTextProps) {
  return (
    <label className="block text-xs">
      {label}
      <textarea
        className="mt-1 block min-h-24 w-full rounded-md border border-input bg-background p-2 text-sm"
        {...props}
      />
    </label>
  )
}
export function ResearchCheck({ children, ...props }: ResearchCheckProps) {
  return (
    <label className="flex items-start gap-2 text-xs">
      <input className="mt-0.5" type="checkbox" {...props} />
      {children}
    </label>
  )
}
