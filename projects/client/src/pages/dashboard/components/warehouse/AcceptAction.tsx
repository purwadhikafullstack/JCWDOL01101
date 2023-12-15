import React, { useEffect } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAcceptMutation } from "@/hooks/useMutation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/clerk-react"
import { useForm } from "react-hook-form"
import { mutationActionSchema } from "./MutationAction"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import ProductFormField from "../ProductFormField"
let emptyValues = {
  notes: "",
}
const AcceptAction = ({ mutationId }: { mutationId: number }) => {
  const { toast } = useToast()
  const { user } = useUser()
  const name = `${user?.firstName} ${user?.lastName}` || user?.username

  const acceptMutation = useAcceptMutation(mutationId)
  const form = useForm<z.infer<typeof mutationActionSchema>>({
    resolver: zodResolver(mutationActionSchema),
    defaultValues: emptyValues,
  })
  const onAcceptMutation = (values: z.infer<typeof mutationActionSchema>) => {
    const data = { ...values, name: String(name) }
    acceptMutation.mutate(data)
  }

  useEffect(() => {
    if (acceptMutation.isSuccess) {
      toast({
        title: "Mutation Completed",
        description: "Successfully accepted mutation request",
        duration: 3000,
      })
    }
  }, [acceptMutation.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Accept Mutation</DialogTitle>
        <DialogDescription>
          You're about to accept mutation request
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAcceptMutation)}>
          <ProductFormField name="notes" label="Notes (optional)" />
          <span className="mt-4 flex justify-center gap-4 w-full">
            <Button
              type="submit"
              variant="destructive"
              disabled={acceptMutation.isPending}
              className="cursor-pointer "
            >
              <Loader2
                className={
                  acceptMutation.isPending
                    ? "animate-spin w-4 h-4 mr-2"
                    : "hidden"
                }
              />
              Yes, accept mutation
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={acceptMutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
          </span>
        </form>
      </Form>
    </DialogContent>
  )
}

export default AcceptAction
