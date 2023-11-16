import React from "react"
import { SignIn } from "@clerk/clerk-react"

const Login = () => {
  return (
    <main className="flex justify-center items-center mt-24">
      <SignIn />
      {/* <div className="relative">
        <div className="z-10">
          <p>login</p>
        </div>
        <div className="hidden lg:block w-[900px] absolute top-[30px] -left-[300px] -z-10">
          <img
            className="w-full h-full"
            src="/ilus/laptop.svg"
            alt="laptop ilus"
          />
        </div>
      </div> */}
    </main>
  )
}

export default Login
