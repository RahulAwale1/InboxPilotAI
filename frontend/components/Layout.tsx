import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#E8D8C4] text-[#561C24]">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}