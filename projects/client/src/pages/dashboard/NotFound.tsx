import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-center">
      <div className="flex items-center gap-2 justify-between ">
        <Button variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <p className="font-bold">Page not found</p>
      </div>
      <p>The page you are looking for does not exist.</p>
      <img src="/ilus/404.svg" alt="404" className="w-1/4" />
    </div>
  );
};

export default NotFound;
