import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/useUser"
import ProductFormField from "../components/ProductFormField"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/clerk-react"
import { usePostMutation } from "@/hooks/useMutation"
import InputProductField from "../components/warehouse/InputProductField"
const mutationSchema = z.object({
  receiverWarehouse: z.string().min(1, "You must select warehouse"),
  productId: z.number().min(1, "You must select product"),
  quantity: z.number().min(1, "Product can't be empty"),
  notes: z.string().optional(),
})
let emptyValues = {
  receiverWarehouse: "",
  productId: 0,
  quantity: 0,
  notes: "",
}

function MutationForm() {
  const { toast } = useToast()

  const { user, isSignedIn, isLoaded } = useUser()
  const { data: adminUser } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })

  const createMutation = usePostMutation()

  const form = useForm<z.infer<typeof mutationSchema>>({
    resolver: zodResolver(mutationSchema),
    defaultValues: emptyValues,
  })
  const onSubmit = (values: z.infer<typeof mutationSchema>) => {
    const mutation = {
      ...values,
    }
    console.log(values)
    // createMutation.mutate(values)
  }

  useEffect(() => {
    if (createMutation.isSuccess) {
      toast({
        title: "Mutation Created",
        description: "Successfully create mutation",
        duration: 3000,
      })
    }
  }, [createMutation.isSuccess, toast])

  // useEffect(() => {
  //   if (user) {
  //     form.setValue("role", user?.role)
  //     form.setValue("username", user?.username)
  //     form.setValue("firstname", user?.firstname)
  //     form.setValue("lastname", user?.lastname)
  //     form.setValue("email", user?.email)
  //     form.setValue("status", user?.status)
  //   }
  // }, [user, form])

  return (
    <div className="w-full">
      <span className="flex text-sm ">
        <Link to="/dashboard/manage-mutation" className="text-muted-foreground">
          manage-mutation /
        </Link>
        <p className="text-primary ml-1">create-form</p>
      </span>
      <div className="w-[768px] mx-auto">
        <h2 className="text-xl mb-10">Create Mutation</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full grid grid-cols-2 gap-2">
              <InputProductField />
              <ProductFormField
                name="receiverWarehouse"
                label="Select Warehouse"
              />
            </div>
            <ProductFormField name="quantity" label="Quantity" />
            <ProductFormField name="notes" label="Notes (optional)" />
            <div className="w-full flex justify-center gap-4 mt-10">
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer "
              >
                <Loader2
                  className={
                    createMutation.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                Create Mutation
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default MutationForm
