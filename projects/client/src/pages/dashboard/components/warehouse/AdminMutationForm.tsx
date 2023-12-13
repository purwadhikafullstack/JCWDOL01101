import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/useUser"
import ProductFormField from "../ProductFormField"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/clerk-react"
import { usePostMutation } from "@/hooks/useMutation"
import InputProductField from "../warehouse/InputProductField"
import ReceiverWarehouseField from "./ReceiverWarehouseField"
import QuantityInput from "../warehouse/QuantityInput"
import SenderWarehouseField from "./SenderWarehouseField"
const mutationSchema = z.object({
  senderWarehouseId: z.string().min(1, "You must select warehouse"),
  receiverWarehouseId: z.string().min(1, "You must select warehouse"),
  productId: z.number().min(1, "You must select product"),
  quantity: z.string().min(1, "Product can't be empty"),
  notes: z.string().optional(),
})
let emptyValues = {
  senderWarehouseId: "",
  receiverWarehouseId: "",
  productId: 0,
  quantity: "",
  notes: "",
}

const AdminMutationForm = () => {
  const { toast } = useToast()
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })
  const adminName =
    `${userAdmin?.firstname} ${userAdmin?.lastname}` || userAdmin?.username
  const createMutation = usePostMutation()
  const form = useForm<z.infer<typeof mutationSchema>>({
    resolver: zodResolver(mutationSchema),
    defaultValues: emptyValues,
  })
  const onSubmit = (values: z.infer<typeof mutationSchema>) => {
    const mutation = {
      ...values,
      receiverWarehouseId: Number(values.receiverWarehouseId),
      senderWarehouseId: Number(values.senderWarehouseId),
      senderName: String(adminName),
      quantity: Number(values.quantity),
    }
    createMutation.mutate(mutation)
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

  const productId = form.watch("productId")
  const warehouseId = form.watch("senderWarehouseId")
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
        <div className="flex gap-1 text-sm font-semibold mb-2">
          <p>Sender Name :</p>
          <p>{adminName}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="w-full grid grid-cols-2 gap-2">
              <InputProductField />
              <QuantityInput name="quantity" label="Quantity" />
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <SenderWarehouseField />
              <ReceiverWarehouseField
                productId={productId}
                warehouseId={Number(warehouseId)}
              />
            </div>
            <ProductFormField name="notes" label="Notes (optional)" />
            <div className="w-full flex justify-center gap-4 mt-10">
              <Button
                type="submit"
                disabled={createMutation.isPending}
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

export default AdminMutationForm
