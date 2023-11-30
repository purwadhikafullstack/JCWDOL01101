import React from "react"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from "@clerk/clerk-react"
import ProfileUpload from "./ProfileUpload"

export interface Profile {
  url: string
  name: string
}

function ProfileAvatar() {
  const { user } = useUser()
  if (!user) return null

  return (
    <div className="w-max rounded-md border shadow-sm overflow-hidden p-4 flex flex-col gap-4">
      <img src={user.imageUrl} alt="user" className="w-64" />
      <Dialog>
        <DialogTrigger className={buttonVariants({ variant: "default" })}>
          Change Image
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <ProfileUpload />
        </DialogContent>
      </Dialog>
      <p className="text-xs w-64">
        Max File Size: 5MB, only JPG, JPEG, PNG are supported.
      </p>
    </div>
  )
}

export default ProfileAvatar
