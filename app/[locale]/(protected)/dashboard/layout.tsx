import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trafficboxes",
  description: "Trafficboxes",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
    {children}</>;
};

export default Layout;
