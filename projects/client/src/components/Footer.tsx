import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t py-6 mt-24 pb-10 md:pb-24">
      <div className="container justify-between flex flex-col md:flex-row gap-4 ">
        <div>
          <h4 className="font-bold text-base lg:text-lg">About Toten</h4>
          <ul className="space-y-1 lg:mt-2 text-sm lg:text-base">
            <li>Information</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base lg:text-lg">Contact Us</h4>
          <ul className="space-y-1 lg:mt-2 text-sm lg:text-base ">
            <li>For Toten Customer Complain Service,</li>
            <li>customersupport@toten.co.id</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base lg:text-lg mb-2">
            Toten Social Account
          </h4>
          <div className="flex gap-2 ">
            <span className="p-2 rounded-md w-max border border-muted bg-white hover:bg-muted cursor-pointer">
              <FacebookIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-white hover:bg-muted cursor-pointer">
              <TwitterIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-white hover:bg-muted cursor-pointer">
              <InstagramIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-white hover:bg-muted cursor-pointer">
              <YoutubeIcon strokeWidth={1} />
            </span>
          </div>
          <p className="text-center my-2 text-sm text-muted-foreground">
            copyright &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
