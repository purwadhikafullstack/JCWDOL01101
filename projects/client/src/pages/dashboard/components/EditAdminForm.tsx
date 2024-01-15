import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useEditAdmin } from "@/hooks/useUserMutation"
import UserSelectFormField from "./UserSelectFormField"
import ProductFormField from "./ProductFormField"
import { adminEditSchema } from "./AdminAction"
import { useToast } from "@/components/ui/use-toast"

let emptyValues = {
  role: "",
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  status: "",
  password: undefined,
}
const EditAdminForm = () => {
  const { toast } = useToast()
  const { userId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!Number(userId)) {
      navigate("/dashboard/manage-admin")
    }
  }, [userId, navigate])
  const { data: user } = useUser(Number(userId))

  const userMutation = useEditAdmin(Number(userId))

  const form = useForm<z.infer<typeof adminEditSchema>>({
    resolver: zodResolver(adminEditSchema),
    defaultValues: emptyValues,
  })
  const onSubmit = (values: z.infer<typeof adminEditSchema>) => {
    userMutation.mutate(values)
  }

  useEffect(() => {
    if (userMutation.isSuccess) {
      toast({
        title: "Admin Updated",
        description: "Successfully update admin data",
        duration: 3000,
      })
    }
  }, [userMutation.isSuccess, toast])

  useEffect(() => {
    if (user) {
      form.setValue("role", user?.role)
      form.setValue("username", user?.username)
      form.setValue("firstname", user?.firstname)
      form.setValue("lastname", user?.lastname)
      form.setValue("email", user?.email)
      form.setValue("status", user?.status)
    }
  }, [user, form])

  const [changePassword, setChangePassword] = useState(true)
  return (
    <div className="w-full">
      <span className="flex text-sm">
        <Link to="/dashboard/manage-admin" className="text-muted-foreground">
          manage-admin /
        </Link>
        <p className="text-primary ml-1">{`${user?.firstname} ${user?.lastname}`}</p>
      </span>
      <div className="w-[768px] mx-auto">
        <h2 className="text-xl mb-10">Edit Admin</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ProductFormField name="username" label="Username" />
            <div className="w-full grid grid-cols-2 gap-2">
              <ProductFormField name="firstname" label="First Name" />
              <ProductFormField name="lastname" label="Last Name" />
            </div>
            <ProductFormField name="email" label="Email" />
            <div className={`${changePassword && "hidden"} w-full`}>
              <ProductFormField
                name="password"
                label="Password (Optional)"
                description="This will rewrite the user password"
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <UserSelectFormField name="role" label="Role" />
              <UserSelectFormField name="status" label="Status" />
            </div>
            <div className="w-full flex justify-center gap-4 mt-10">
              <Button
                type="button"
                variant="secondary"
                className={`${!changePassword && "hidden"}`}
                onClick={() => setChangePassword(false)}
              >
                Change Password
              </Button>
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
                Edit Admin
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditAdminForm
