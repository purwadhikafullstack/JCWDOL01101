import React, { useEffect } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRejectMutation } from "@/hooks/useMutation"
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
const RejectAction = ({ mutationId }: { mutationId: number }) => {
  const { toast } = useToast()
  const { user } = useUser()
  const name = `${user?.firstName} ${user?.lastName}` || user?.username

  const rejectMutation = useRejectMutation(mutationId)
  const form = useForm<z.infer<typeof mutationActionSchema>>({
    resolver: zodResolver(mutationActionSchema),
    defaultValues: emptyValues,
  })
  const onRejectMutation = (values: z.infer<typeof mutationActionSchema>) => {
    const data = { ...values, name: String(name) }
    rejectMutation.mutate(data)
  }

  useEffect(() => {
    if (rejectMutation.isSuccess) {
      toast({
        title: "Mutation Rejected",
        description: "Successfully reject mutation request",
        duration: 3000,
      })
    }
  }, [rejectMutation.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Mutation</DialogTitle>
        <DialogDescription>
          You're about to reject mutation request
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRejectMutation)}>
          <ProductFormField name="notes" label="Notes (optional)" />
          <span className="mt-4 flex justify-center gap-4 w-full">
            <Button
              type="submit"
              variant="destructive"
              disabled={rejectMutation.isPending}
              className="cursor-pointer "
            >
              <Loader2
                className={
                  rejectMutation.isPending
                    ? "animate-spin w-4 h-4 mr-2"
                    : "hidden"
                }
              />
              Yes, reject mutation
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={rejectMutation.isPending}
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

export default RejectAction
