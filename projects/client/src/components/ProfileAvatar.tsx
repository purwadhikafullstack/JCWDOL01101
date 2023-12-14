import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Verified } from "lucide-react";
import React from "react";

const ProfileAvatar = () => {
  const { user } = useUser();
  return (
    <div className="flex gap-2 items-start">
      <UserAvatar />
      <div className="flex flex-col text-sm">
        <span className="font-bold flex items-center">
          <p>{user?.username || user?.firstName || "-"}</p>
          {user?.hasVerifiedEmailAddress && (
            <Verified className="ml-2 w-4 h-4 text-primary" />
          )}
        </span>
        <p className="text-xs">{user?.emailAddresses[0].emailAddress}</p>
      </div>
    </div>
  );
};

export function UserAvatar() {
  const { user } = useUser();
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback>
        {user ? user.username?.substring(0, 2) : ""}
      </AvatarFallback>
    </Avatar>
  );
}

export default ProfileAvatar;
