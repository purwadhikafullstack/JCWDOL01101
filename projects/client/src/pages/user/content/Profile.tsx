import UserContext from "@/context/UserContext";
import React, { useContext } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import { User } from "lucide-react";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  return (
    <>
      <div className="md:p-6 flex flex-col md:flex-row md:gap-8">
        <ProfileAvatar />
        <div className="py-2 flex flex-col space-y-4 mt-10 md:mt-0">
          <span className="flex items-center gap-1 mb-4">
            <User />
            <h2 className="text-2xl ml-1">Account</h2>
          </span>
          <LabelName label="First Name" data={user?.firstname || "no data"} />
          <LabelName label="Last Name" data={user?.lastname || "no data"} />
          <LabelName label="Username" data={user?.username || "no data"} />
          <LabelName label="Email" data={user?.email || "no data"} />
          <LabelName label="Status" data={user?.status || "no data"} />
          <EditProfile />
        </div>
      </div>
    </>
  );
};

const LabelName = ({ label, data }: { label: string; data: string }) => {
  return (
    <span className="flex text-lg">
      <p className="w-[150px]">{label}</p>
      <p>{data}</p>
    </span>
  );
};

export default Profile;
