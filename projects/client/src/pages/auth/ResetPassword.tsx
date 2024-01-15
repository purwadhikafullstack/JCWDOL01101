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


const ResetPassword = () => {
  return (
    <div>Hello</div>
  );
};

export default ResetPassword;
