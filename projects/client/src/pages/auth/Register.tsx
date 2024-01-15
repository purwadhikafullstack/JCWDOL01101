import React, { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useSignUp } from "@clerk/clerk-react"
import { Loader } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const registerSchema = z.object({
  email: z.string().email().min(2),
})

const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useSignUp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    try {
      const register = await signUp?.create({
        emailAddress: values.email,
      })
      const result = await register?.prepareVerification({
        strategy: "email_code",
      })
      if (result) {
        setIsLoading(false)
        navigate(`/verify?uid=${result?.id}`)
      }
    } catch (err: any) {
      setIsLoading(false)
      setError(err.errors[0].message)
    }
  }

  const signUpWithGoogle = () => {
    return signUp?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    })
  }

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
            <h3 className="font-bold text-lg">Create an account</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
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
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            onClick={signUpWithGoogle}
            className="w-full"
            variant="outline"
          >
            Google
          </Button>
          {error && (
            <Alert className="mt-8" variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          )}

          <p className="px-8 text-center text-sm text-muted-foreground mt-6">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register
