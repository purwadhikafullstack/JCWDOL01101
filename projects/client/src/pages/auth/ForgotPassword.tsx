import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import type { NextPage } from "next";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";

const ForgotPassword: NextPage = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  async function create(e: any) {
    e.preventDefault();
    const email = e.target[0].value;
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
      })
      .catch((err) => console.error("error", err.errors[0].longMessage));
  }

  async function reset(e: any) {
    e.preventDefault();
    const password = e.target[0].value;
    const code = e.target[1].value;
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setComplete(true);
        } else {
          console.log(result);
        }
      })
      .catch((err) => console.error("error", err.errors[0].longMessage));
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
            <h3 className="font-bold text-lg">Forgot Your Password?</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email below so we can help you
            </p>
          </span>
          <form onSubmit={!successfulCreation ? create : reset}>
            {!successfulCreation && !complete && (
              <>
                <input
                  type="email"
                  placeholder="e.g john@doe.com"
                  className="w-full border border-gray-300 text-black rounded px-3 py-2 "
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                >
                  {" "}
                  Submit
                </Button>
              </>
            )}
            {successfulCreation && !complete && (
              <>
                <input
                  type="password"
                  className="w-full border border-gray-300 text-black rounded px-3 py-2 "
                  placeholder="New Password"
                  required
                />
                <input
                  type="text"
                  className="w-full border border-gray-300 text-black rounded px-3 py-2 "
                  placeholder="Verification Code"
                  required
                />
                <p className="text-slate-400 text-sm">Check Your Email for Verification Code</p>
                <Button
                  type="submit"
                  className="w-full"
                >
                  {" "}
                  Submit
                </Button>
              </>
            )}
            {complete && "You successfully changed you password"}
            {secondFactor && "2FA is required, this UI does not handle that"}
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
