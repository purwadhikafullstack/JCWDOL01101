import { useSignUp } from "@clerk/clerk-react"
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import StepperAction from "@/components/StepperAction"
import EmailVerificationForm from "./EmailVerificationForm"
import SetPasswordForm from "./SetPasswordForm"

const Verification = () => {
  const navigate = useNavigate()
  const { signUp } = useSignUp()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState("verify")
  const [isStepperDone, setIsStepperDone] = useState({
    verify: false,
    pwd: false,
  })

  const uuid = searchParams.get("uid")
  const id = signUp?.id

  useEffect(() => {
    if (uuid !== id) {
      navigate(-1)
    }
  }, [navigate, id, uuid])

  const setStepper = (v: boolean, p: boolean) => {
    setIsStepperDone({ verify: v, pwd: p })
  }
  return (
    <div className="w-full mt-10 flex items-center justify-center">
      <div className="w-[380px] lg:min-w-[726px] xl:min-w-[726px] min-h-[600px] flex flex-col justify-center">
        <img src="/ilus/campaign.svg" alt="campaign.svg" />
        <Tabs value={tab} className="w-full">
          <TabsList>
            <TabsTrigger className="w-full" value="verify">
              <StepperAction
                step={1}
                isActive={tab === "verify"}
                title="Verification"
                isDone={isStepperDone.verify}
                detail="Check email for verification code"
              />
            </TabsTrigger>
            <TabsTrigger value="info" className="w-full">
              <StepperAction
                step={2}
                isActive={tab === "password"}
                isDone={isStepperDone.pwd}
                title="Password"
                detail="Set up your password"
              />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="verify">
            <EmailVerificationForm
              setTab={setTab}
              tab={tab}
              setIsStepperDone={setStepper}
            />
          </TabsContent>
          <TabsContent value="password">
            <SetPasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Verification
