import React, { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/clerk-react"
import { Profile } from "./ProfileAvatar"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

const MaxFileSize = 5 * 1024 * 1024

const ProfileUpload = () => {
  const { user } = useUser()
  if (!user) return null

  const [files, setFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error("Image error")
      } else {
        const validFiles = acceptedFiles.filter(
          (file) => file.size <= MaxFileSize
        )

        if (validFiles.length < acceptedFiles.length) {
          toast.error(
            `files exceed the maximum allowed size of ${
              MaxFileSize / (1024 * 1024)
            } MB.`
          )
        }

        setFiles(validFiles)
        const previews = validFiles.map((file) => URL.createObjectURL(file))
        setPreviewImages(previews)
      }
    },
    [setFiles, setPreviewImages]
  )

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    onDrop,
  }

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions)

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No file selected.")
      return
    }

    const setProfileImageParams = {
      file: files[0],
    }

    try {
      await user.setProfileImage(setProfileImageParams)
      toast.success("Profile image updated successfully.")
    } catch (error) {
      toast.error("Failed to update profile image.")
    }
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex items-center justify-center border-dashed border-2 border-gray-300 h-64 overflow-hidden"
      >
        <input {...getInputProps()} className="hidden" />
        {previewImages.length === 0 && (
          <p className="text-gray-700">
            Drag & drop or click to select an image
          </p>
        )}

        {previewImages.length > 0 && (
          <div className="flex flex-wrap justify-center">
            {previewImages.map((preview, index) => (
              <div key={index} className="m-2 h-full">
                <img className="h-max" src={preview} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="flex justify-center mt-2">
          <Button variant="default" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProfileUpload
