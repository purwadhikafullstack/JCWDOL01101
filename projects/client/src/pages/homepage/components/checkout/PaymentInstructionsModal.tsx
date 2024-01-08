import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog";
import { useQuery } from "@tanstack/react-query";
import service from "@/service";
import { Button } from "@/components/ui/button";
import { cn, formatToIDR } from "@/lib/utils";
import { CheckCircle, Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type Props = {
  isOpen: boolean;
  paymentLink: string;
};

interface PaymentData {
  order: {
    invoice_number: string;
    amount: number;
  };
  virtual_account_info: {
    virtual_account_number: string;
    expired_in: string;
    created_date: string;
    expired_date: string;
    status: string;
  };
  customer: {
    name: string;
    email: string;
  };
  payment_instruction: {
    step: string[];
    channel: string;
  }[];
}

const PaymentInstructionsModal = ({ isOpen, paymentLink }: Props) => {
  const navigate = useNavigate();
  const { data: paymentData } = useQuery<PaymentData>({
    queryKey: ["paymentData"],
    queryFn: async () => {
      const res = await service.get(paymentLink);
      return res.data;
    },
    enabled: !!paymentLink,
  });

  const paymentStatus = paymentData && paymentData.virtual_account_info.status;
  return (
    paymentData && (
      <Dialog open={isOpen}>
        <DialogContent
          className={cn(
            "overflow-y-auto",
            paymentStatus === "OPEN" && "h-[600px]"
          )}
        >
          {paymentStatus === "OPEN" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg py-2 font-bold">
                  Toten Checkout
                </DialogTitle>
                <div className="w-full bg-orange-200 text-orange-500  py-4 px-4">
                  Complete Payment in{" "}
                  {paymentData.virtual_account_info.expired_in}
                </div>
              </DialogHeader>
              {paymentData && (
                <div className="flex flex-col space-y-4 border shadow-sm p-4">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Payment
                    </p>
                    <b className="text-2xl text-primary">
                      {formatToIDR(paymentData.order.amount)}
                    </b>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Payment Status
                    </p>
                    <Badge>
                      {paymentStatus === "OPEN"
                        ? "Waiting for payment"
                        : "PAID"}
                    </Badge>
                  </div>
                </div>
              )}
              <div>
                <p className="font-bold text-lg">Please Transfer to</p>
                <div className="p-4">
                  <p className="text-muted-foreground text-sm">
                    Destination Account Number
                  </p>
                  <span className="flex items-center gap-2">
                    <b>
                      {paymentData?.virtual_account_info.virtual_account_number}
                    </b>
                    <Copy
                      onClick={() => {
                        navigator.clipboard.writeText(
                          paymentData?.virtual_account_info
                            .virtual_account_number || ""
                        );
                        toast.success("Copied to clipboard");
                      }}
                      className="w-4 h-4 text-muted-foreground cursor-pointer"
                    />
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-lg">Payment Instructions</p>
                <Accordion type="single" collapsible className="p-4 text-sm">
                  {paymentData?.payment_instruction.map((item, index) => (
                    <AccordionItem value={index.toString()} key={index}>
                      <AccordionTrigger>{item.channel}</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside">
                          {item.step.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </>
          )}
          {paymentStatus === "PAID" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-primary" />
              <p className="text-primary">Payment has been received</p>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => navigate("/transactions")}
              className="w-full uppercase"
            >
              Click here after payment
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="w-full uppercase"
            >
              Back to Main Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default PaymentInstructionsModal;
