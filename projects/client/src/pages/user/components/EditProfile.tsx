import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUserContext } from "@/context/UserContext"
import z from "zod"
import { Form } from "@/components/ui/form"
import ProductFormField from "@/pages/dashboard/components/ProductFormField"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Button, buttonVariants } from "@/components/ui/button"
import { Edit, Loader2 } from "lucide-react"
import { useEditUser } from "@/hooks/useUserMutation"

const EditProfileSchema = z.object({
  firstname: z.string().trim().min(1, "firstname cannot be empty"),
  lastname: z.string().trim(),
  username: z.string().trim().min(1, "firstname cannot be empty"),
})
let emptyValues = {
  firstname: "",
  lastname: "",
  username: "",
}

function EditProfile() {
  const [open, setOpen] = useState(false)
  const { user } = useUserContext()
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
      setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        <Edit className="mr-2" /> Edit
      </DialogTrigger>
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
    </Dialog>
  )
}

export default EditProfile
