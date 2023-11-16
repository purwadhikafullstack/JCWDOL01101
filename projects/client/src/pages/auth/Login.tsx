import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email().min(2),
  password: z.string().min(2, {
    message: "Password must contain at least 8 character(s)",
  }),
});
const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {};
  return (
    <main className="flex justify-center items-center  mt-24">
      <div className="relative w-[350px] lg:w-[540px] mx-auto">
        <div className="z-10 border rounded-lg p-4 px-8 bg-background shadow-sm">
          <img
            className="w-full mx-auto"
            src="/ilus/campaign.svg"
            alt="sign-in ilustration"
          />
          <Button className="w-full" variant="outline">
            Login with Google
          </Button>
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Login
              </Button>
              <span className="flex w-full justify-center items-center mt-2">
                Don't have an account ?{" "}
                <Link
                  to="/register"
                  className="ml-2  text-primary hover:underline"
                >
                  Register
                </Link>{" "}
              </span>
            </form>
          </Form>
        </div>
        <div className=" w-[380px] lg:w-[900px] absolute transform top-0 left-1/2  -translate-x-1/2  -z-10">
          <img
            className="w-full h-full"
            src="/ilus/laptop.svg"
            alt="laptop ilus"
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
