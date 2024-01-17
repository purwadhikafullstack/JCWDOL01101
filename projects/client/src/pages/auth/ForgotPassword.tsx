import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import type { NextPage } from "next";

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
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="Obg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="'text-4xl text-center font-semibold mb-8">
          {successfulCreation && !complete ? "New Password" : "Forgot Password"}
        </h1>
        <form onSubmit={!successfulCreation ? create : reset}>
          {!successfulCreation && !complete && (
            <>
              <input
                type="email"
                placeholder="e.g john@doe.com"
                className="w-full border border-gray-300 text-black rounded px-3 py-2 "
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                {" "}
                Submit
              </button>
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
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                {" "}
                Submit
              </button>
            </>
          )}
          {complete && "You successfully changed you password"}
          {secondFactor && "2FA is required, this UI does not handle that"}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
