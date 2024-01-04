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
    // <main className="flex justify-center items-center  mt-24">
    //   <div className="relative w-[350px] lg:w-[540px] mx-auto">
    //     <div className="z-10 border rounded-lg p-4 px-8 bg-background shadow-sm">
    //       <img
    //         className="w-full mx-auto"
    //         src="/ilus/campaign.svg"
    //         alt="sign-in ilustration"
    //       />
    //       {/* <Form {...form}>
    //         <form
    //           className="space-y-4 mt-6"
    //         >
    //           <FormField
    //             control={form.control}
    //             name="email"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel htmlFor="email">Email</FormLabel>
    //                 <FormControl>
    //                   <Input
    //                     type="email"
    //                     placeholder="name@example.com"
    //                     {...field}
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
            

    //           <Button className="w-full" type="submit">
    //             Login
    //           </Button>
    //         </form>
    //       </Form> */}
    //     </div>
    //   </div>
    // </main>
  );
};

export default ResetPassword;
