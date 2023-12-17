import React, { useContext, useEffect } from "react"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import UserContext from "@/context/UserContext"
import z from "zod"
import { Form } from "@/components/ui/form"
import ProductFormField from "@/pages/dashboard/components/ProductFormField"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEditUser } from "@/hooks/useUserMutation"

const EditProfileSchema = z.object({
  firstname: z.string().min(1, "firstname cannot be empty"),
  lastname: z.string(),
  username: z.string().min(1, "firstname cannot be empty"),
})
let emptyValues = {
  firstname: "",
  lastname: "",
  username: "",
}

function EditProfile() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider")
  }
  const { user } = userContext

  const userMutation = useEditUser(Number(user?.id))

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: emptyValues,
  })
  const onSubmit = (values: z.infer<typeof EditProfileSchema>) => {
    userMutation.mutate(values)
  }

  useEffect(() => {
    if (userMutation.isSuccess) {
      toast.success("Successfully update profile")
    }
  }, [userMutation.isSuccess, toast])

  useEffect(() => {
    if (user) {
      form.setValue("username", user?.username)
      form.setValue("firstname", user?.firstname)
      form.setValue("lastname", user?.lastname)
    }
  }, [user, form])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-2 gap-2">
            <ProductFormField name="firstname" label="First Name" />
            <ProductFormField name="lastname" label="Last Name" />
          </div>
          <ProductFormField name="username" label="Username" />
          <div className="w-full flex justify-center mt-4">
            <Button
              type="submit"
              variant="destructive"
              disabled={userMutation.isPending}
              className="cursor-pointer "
            >
              <Loader2
                className={
                  userMutation.isPending
                    ? "animate-spin w-4 h-4 mr-2"
                    : "hidden"
                }
              />
              Edit Profile
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

export default EditProfile
