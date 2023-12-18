import React, { useEffect, FormEvent } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCancelMutation } from "@/hooks/useMutation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function CancelAction({ mutationId }: { mutationId: number }) {
  const cancelMutation = useCancelMutation(mutationId)
  const { toast } = useToast()
  const onCancelMutation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    cancelMutation.mutate()
  }

  useEffect(() => {
    if (cancelMutation.isSuccess) {
      toast({
        title: "Mutation Canceled",
        description: "Successfully cancel mutation request",
        duration: 3000,
      })
    }
  }, [cancelMutation.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Mutation</DialogTitle>
        <DialogDescription>You're about to cancel mutation</DialogDescription>
      </DialogHeader>
      <form onSubmit={onCancelMutation}>
        <span className="flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={cancelMutation.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                cancelMutation.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            Yes, cancel mutation
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default CancelAction
