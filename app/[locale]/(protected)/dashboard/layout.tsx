import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trafficboxes",
  description: "Trafficboxes",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
    <PageTitle className="mb-6" />
    {children}</>;
};

export default Layout;
