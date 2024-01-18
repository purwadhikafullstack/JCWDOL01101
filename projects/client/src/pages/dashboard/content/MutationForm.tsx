import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/useUser"
import ProductFormField from "../components/ProductFormField"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/clerk-react"
import { usePostMutation } from "@/hooks/useMutation"
import ReceiverWarehouseField from "../components/warehouse/ReceiverWarehouseField"
import QuantityInput from "../components/warehouse/QuantityInput"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { baseURL } from "@/service"
import { useProduct } from "@/hooks/useProduct"

import ProductSizeSelect from "../components/warehouse/ProductSizeSelect"
import CurrentWarehouseDetail from "../components/warehouse/CurrentWarehouseDetail"
import Hashids from "hashids"
import { Helmet } from "react-helmet"
const hashids = new Hashids("TOTEN", 10)

const mutationSchema = z.object({
  receiverWarehouseId: z.string().min(1, "You must select warehouse"),
  sizeId: z.string().min(1),
  quantity: z.string().min(1, "Product can't be empty"),
  notes: z.string().trim().optional(),
})

let emptyValues = {
  receiverWarehouseId: "",
  sizeId: "",
  quantity: "",
  notes: "",
}

const MutationForm = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const warehouseId = params.get("warehouse") || undefined

  const { toast } = useToast()
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id,
    enabled: isLoaded && !!isSignedIn,
  })
  const { data: pd } = useProduct(slug)

  const adminName =
    userAdmin?.firstname || userAdmin?.lastname
      ? `${userAdmin?.firstname} ${userAdmin?.lastname}`
      : userAdmin?.username || userAdmin?.email

  const createMutation = usePostMutation()
  const form = useForm<z.infer<typeof mutationSchema>>({
    resolver: zodResolver(mutationSchema),
    defaultValues: emptyValues,
  })
  const onSubmit = (values: z.infer<typeof mutationSchema>) => {
    if (warehouseId && pd) {
      const currentWarehouseId = Number(hashids.decode(warehouseId))
      const mutation = {
        ...values,
        sizeId: Number(values.sizeId),
        productId: pd.product.id,
        receiverWarehouseId: Number(values.receiverWarehouseId),
        senderWarehouseId: currentWarehouseId,
        senderName: String(adminName),
        quantity: Number(values.quantity),
      }
      createMutation.mutate(mutation)
    }
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

  return (
    <>
      <Helmet>
        <title>Dashboard | Mutation Form</title>
      </Helmet>
      <span className="flex text-sm mb-8">
        <Link
          to={`/dashboard/product/?page=1&warehouse=${warehouseId}`}
          className="text-muted-foreground"
        >
          products /
        </Link>
        <p className="text-primary ml-1">create mutation</p>
      </span>
      <div className="flex  gap-10 ">
        <div className="flex-1">
          <div className="flex  gap-4">
            {pd && (
              <LazyLoadImage
                effect="opacity"
                className="w-[300px] h-full object-contain"
                src={`${baseURL}/images/${pd.product.primaryImage}`}
              />
            )}
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold mb-2">{pd?.product.name}</h2>
              <p className="text-sm text-muted-foreground">
                {pd?.product.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 mx-auto">
          <h2 className="text-xl mb-10">Create Mutation</h2>
          <div className="flex gap-1 text-sm font-semibold mb-2">
            <p>Sender Name :</p>
            <p>{adminName}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="w-full grid grid-cols-2 gap-2">
                <ProductSizeSelect
                  productId={pd?.product.id}
                  warehouseId={warehouseId}
                />
                <QuantityInput name="quantity" label="Quantity" />
              </div>
              {pd && (
                <div className="w-full grid grid-cols-2 gap-2">
                  <CurrentWarehouseDetail />
                  <ReceiverWarehouseField
                    productId={pd.product.id}
                    warehouseId={warehouseId}
                  />
                </div>
              )}
              <ProductFormField name="notes" label="Notes (optional)" />
              <div className="w-full flex  gap-4 mt-10">
                <Button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dashboard/product/?page=1&warehouse=${warehouseId}`
                    )
                  }
                  variant="secondary"
                >
                  Cancel
                </Button>
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
    </>
  )
}

export default MutationForm
