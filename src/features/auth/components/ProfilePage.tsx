import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { toast } from "sonner"
import { ApiError } from "@/lib/api"

export function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()
  const [firstName, setFirstName] = useState(user?.first_name || "")
  const [lastName, setLastName] = useState(user?.last_name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    try {
      await updateProfile({ first_name: firstName, last_name: lastName })
      toast.success("Profile updated")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to update profile")
      }
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      toast.success("Password changed")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to change password")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Panel>
        <PanelHead title="Profile information" hint="name shown on your account" />
        <PanelBody>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user?.username || ""}
                  disabled
                  className="h-10 font-mono text-[13px]"
                />
                <p className="font-mono text-[11px] text-ink-3">
                  cannot be changed
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="h-10 font-mono text-[13px]"
                />
                <p className="font-mono text-[11px] text-ink-3">
                  cannot be changed
                </p>
              </div>
            </div>
            <div className="flex justify-end border-t border-border pt-4">
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHead title="Password" hint="minimum 6 characters" />
        <PanelBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                required
                autoComplete="current-password"
                className="h-10"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex justify-end border-t border-border pt-4">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Changing…" : "Change password"}
              </Button>
            </div>
          </form>
        </PanelBody>
      </Panel>
    </div>
  )
}
