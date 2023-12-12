import { Button } from "@/components/ui/button";
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
import { EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router-dom";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email().min(2),
  password: z.string().min(2, {
    message: "Password must contain at least 8 character(s)",
  }),
});

type RedicrectLocationState = {
  redirectTo: Location;
};
const Login = () => {
  const { state: locationState } = useLocation();
  const [passwordVisible, setPasswordVisible] = useState({
    pwd: false,
    confirm: false,
  });
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!isLoaded) return;
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        let url = "";
        if (locationState) {
          const { redirectTo } = locationState as RedicrectLocationState;
          url = `${redirectTo.pathname}${redirectTo.search}`;
        } else {
          url = "/";
        }
        navigate(url);
      }
    } catch (err: any) {
      setError(err.errors[0].longMessage);
    }
  };

  const signInWithGoogle = () => {
    try {
      let url = "";
      if (locationState) {
        const { redirectTo } = locationState as RedicrectLocationState;
        url = `${redirectTo.pathname}${redirectTo.search}`;
      } else {
        url = "/";
      }
      signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: url,
      });
    } catch (err: any) {
      console.log(err);
      setError(err.errors[0].longMessage);
    }
  };
  return (
    <main className="flex justify-center items-center  mt-24">
      <div className="relative w-[350px] lg:w-[540px] mx-auto">
        <div className="z-10 border rounded-lg p-4 px-8 bg-background shadow-sm">
          <img
            className="w-full mx-auto"
            src="/ilus/campaign.svg"
            alt="sign-in ilustration"
          />
          <Button
            onClick={() => signInWithGoogle()}
            className="w-full"
            variant="outline"
          >
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
                      <div className="flex relative">
                        <Input
                          type={passwordVisible.pwd ? "string" : "password"}
                          id="password"
                          {...field}
                        />
                        {passwordVisible.pwd ? (
                          <EyeIcon
                            onClick={() =>
                              setPasswordVisible({
                                ...passwordVisible,
                                pwd: false,
                              })
                            }
                            className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                          />
                        ) : (
                          <EyeClosedIcon
                            onClick={() =>
                              setPasswordVisible({
                                ...passwordVisible,
                                pwd: true,
                              })
                            }
                            className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>{error}</FormDescription>
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
