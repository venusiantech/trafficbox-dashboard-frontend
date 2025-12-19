import React from "react";
import FooterContent from "./footer-content";
import { Link } from "@/components/navigation";
import { Plus, List, User } from "lucide-react";

const DashCodeFooter = async () => {
  return (
    <FooterContent>
      <div className=" md:flex  justify-between text-default-600 hidden">
        <div className="text-center md:ltr:text-start md:rtl:text-right text-sm">
          COPYRIGHT &copy; {new Date().getFullYear()} Trafficboxes, All rights
          Reserved
        </div>
      </div>
      <div className="flex md:hidden justify-around items-center">
        <Link href="/dashboard/campaign/create" className="text-default-600">
          <div>
            <span className="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1">
              <Plus className="h-5 w-5" />
            </span>
            <span className="block text-xs text-default-600">Create Campaign</span>
          </div>
        </Link>
        <Link
          href="/dashboard/profile"
          className="relative bg-card bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-default-300 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
        >
          <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow flex items-center justify-center bg-default-100 dark:bg-default-800 border-2 border-default-200 dark:border-default-700">
            <User className="h-6 w-6 text-default-600 dark:text-default-400" />
          </div>
        </Link>
        <Link href="/dashboard/campaign/list">
          <div>
            <span className="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1">
              <List className="h-5 w-5" />
            </span>
            <span className="block text-xs text-default-600">
              Campaign List
            </span>
          </div>
        </Link>
      </div>
    </FooterContent>
  );
};

export default DashCodeFooter;
