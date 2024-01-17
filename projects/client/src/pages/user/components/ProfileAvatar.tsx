import React from "react"
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
    <div className="w-full md:w-max rounded-md border shadow-sm overflow-hidden p-4 flex flex-col gap-4">
      <img src={user.imageUrl} alt="user" className="w-full md:w-64" />
      <ProfileUpload />
      <p className="text-xs w-64">
        Max File Size: 5MB, only JPG, JPEG, PNG are supported.
      </p>
    </div>
  )
}

export default ProfileAvatar
