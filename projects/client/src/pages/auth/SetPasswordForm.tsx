import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useSignUp } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";

const registerInfoSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must contain at least 8 character(s)",
    }),
    confirm: z.string().min(8, {
      message: "Password must contain at least 8 character(s)",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

const SetPasswordForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState({
    pwd: false,
    confirm: false,
  });
  const form = useForm<z.infer<typeof registerInfoSchema>>({
    resolver: zodResolver(registerInfoSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerInfoSchema>) => {
    setIsLoading(true);
    try {
      const result = await signUp?.update({
        password: values.password,
      });

      if (result?.status === "complete") {
        setIsLoading(false);
        await setActive!({ session: result.createdSessionId });
        localStorage.removeItem("uid");
        navigate("/");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.errors[0].message);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
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
                        setPasswordVisible({ ...passwordVisible, pwd: false })
                      }
                      className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                    />
                  ) : (
                    <EyeClosedIcon
                      onClick={() =>
                        setPasswordVisible({ ...passwordVisible, pwd: true })
                      }
                      className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirm">Confirm Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input
                    type={passwordVisible.confirm ? "string" : "password"}
                    id="confirm"
                    {...field}
                  />
                  {passwordVisible.confirm ? (
                    <EyeIcon
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          confirm: false,
                        })
                      }
                      className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                    />
                  ) : (
                    <EyeClosedIcon
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          confirm: true,
                        })
                      }
                      className="absolute hover:text-primary right-3 top-1/2 h-5 w-5 cursor-pointer -translate-y-1/2 text-muted-foreground peer-focus:text-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert className="mt-8" variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}
        <Button className="w-full" type="submit">
          <Loader
            className={`${isLoading ? "animate-spin" : "hidden"} w-4 h-4 mr-2`}
          />
          Sign Up
        </Button>{" "}
      </form>
    </Form>
  );
};

export default SetPasswordForm;
