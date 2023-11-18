import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

type VerifyError = {
  code: string;
  message: string;
  long_message: string;
};
const verifySchema = z.object({
  code: z.string().min(6).max(6),
});
const EmailVerificationForm = ({
  tab,
  setTab,
  setIsStepperDone,
}: {
  tab: string;
  setTab: (tab: string) => void;
  setIsStepperDone: (v: boolean, p: boolean) => void;
}) => {
  const { signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<VerifyError | null>(null);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const completeSignup = await signUp?.attemptVerification({
        code: values.code,
        strategy: "email_code",
      });

      if (completeSignup?.status !== "complete") {
        setIsLoading(false);
        setTab("password");
        setIsStepperDone(true, false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError({
        message: err.errors[0].message,
        long_message: err.errors[0].long_message,
        code: err.errors[0].code,
      });
    }
  };

  useEffect(() => {
    if (error?.code === "verification_already_verified") {
      setTab("password");
      setIsStepperDone(true, false);
    }
  }, [error, setTab, setIsStepperDone]);

  const resendVerification = async () => {
    setIsLoading(true);
    try {
      const verify = await signUp?.prepareVerification({
        strategy: "email_code",
      });
      if (verify) {
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError({
        code: err.errors[0].code,
        message: err.errors[0].message,
        long_message: err.errors[0].long_message,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="code">Veryfication Code</FormLabel>
              <FormControl>
                <Input type="string" id="code" {...field} />
              </FormControl>
              <FormMessage />
              {error && (
                <FormDescription className="text-primary">
                  {error.long_message || error.message}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Button className="w-full" type="submit">
            <Loader
              className={`${
                isLoading ? "animate-spin" : "hidden"
              } w-4 h-4 mr-2`}
            />
            Verify
          </Button>
          <span className="flex gap-2 justify-center text-sm lg:text-base">
            Don't have a code ?{" "}
            <p
              onClick={resendVerification}
              className="font-semibold text-primary cursor-pointer hover:text-primary/95 hover:underline"
            >
              Resend
            </p>
          </span>
        </div>
      </form>
    </Form>
  );
};

export default EmailVerificationForm;
