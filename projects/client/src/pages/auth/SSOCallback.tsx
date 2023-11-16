import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SSOCallback = () => {
  return <AuthenticateWithRedirectCallback />;
};

export default SSOCallback;
