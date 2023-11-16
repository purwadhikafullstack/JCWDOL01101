import React from "react"
import { SignUp } from "@clerk/clerk-react"

const Register = () => {
  return (
    <main className="flex justify-center items-center gap-2 mt-24">
      <SignUp />
      {/* <div className="w-[600px] self-end hidden lg:block">
        <img
          className="w-full"
          src="/ilus/campaign.svg"
          alt="sign-in ilustration"
        />
      </div>
      <div>
        <p>form</p>
      </div> */}
    </main>
  )
}

export default Register
