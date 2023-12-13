import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ModeToggle from "./ModeToggle";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t py-6 mt-24 pb-10 md:pb-24 hidden lg:block">
      <div className="container justify-between flex flex-col md:flex-row gap-4 ">
        <div>
          <h4 className="font-bold text-base lg:text-lg">
            {t("footer.about")}
          </h4>
          <ul className="space-y-1 lg:mt-2 text-sm lg:text-base">
            <li>{t("footer.childAbout1")}</li>
            <li>{t("footer.childAbout2")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base lg:text-lg">
            {t("footer.contact.head")}
          </h4>
          <ul className="space-y-1 lg:mt-2 text-sm lg:text-base ">
            <li>{t("footer.contact.child1")},</li>
            <li>customersupport@toten.co.id</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-end mb-2 gap-6">
            <LanguageSelector />
            <ModeToggle />
          </div>
          <h4 className="font-bold text-base lg:text-lg mb-2">
            {t("footer.social")}
          </h4>
          <div className="flex gap-2 ">
            <span className="p-2 rounded-md w-max border border-muted bg-background hover:bg-muted cursor-pointer">
              <FacebookIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-background hover:bg-muted cursor-pointer">
              <TwitterIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-background hover:bg-muted cursor-pointer">
              <InstagramIcon strokeWidth={1} />
            </span>
            <span className="p-2 rounded-md border border-muted bg-background hover:bg-muted cursor-pointer">
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
