import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router-dom";
import z from "zod";

const forgotSchema = z.object({
  email: z.string().email().min(2),
})

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  })
  
  return (
    <main className="flex w-full h-screen">
      <div className="flex-1 relative hidden lg:flex flex-col items-center justify-center bg-muted h-full">
        <h3 className="text-center absolute top-0 left-0 pl-8 pt-10  text-3xl text-primary font-bold">
          当店 | Toten
        </h3>
        <img
          className="w-[600px] mx-auto"
          src="/ilus/campaign.svg"
          alt="sign-in ilustration"
        />
      </div>
      <div className="relative rounded-md flex-1 flex items-center justify-center mx-auto p-4">
        <span className="absolute top-0 left-0 pl-8 pt-12 font-bold text-primary lg:hidden">
          当店 | Toten
        </span>
        <span className="absolute top-0 right-0 pr-8 pt-10 ">
          <Link
            to="/login"
            className={buttonVariants({
              variant: "ghost",
              className: "text-primary hover:text-primary/80",
            })}
          >
            Login
          </Link>
        </span>
        <div className="w-full lg:w-[400px]">
          <img
            className="mx-auto lg:hidden"
            src="/ilus/campaign.svg"
            alt="sign-in ilustration"
          />
           <span className="text-center">
            <h3 className="font-bold text-lg">Forgot Your Password?</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email below so we can help you
            </p>
          </span>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                <Loader
                  className={`${
                    isLoading ? "animate-spin" : "hidden"
                  } w-4 h-4 mr-2`}
                />
                Sign Up With Email
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
