import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Topbar";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar />
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

export default RootLayout;

