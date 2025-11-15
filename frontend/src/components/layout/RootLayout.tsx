import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Topbar";
import BottomNavigation from "./BottomNavigation";
import MobileDrawer from "./MobileDrawer";
import { DeepLinkHandler } from "../deeplink/DeepLinkHandler";

import { useThemeStore } from "../../stores/theme";

const RootLayout = () => {
  const { theme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <DeepLinkHandler />
      <div className={`relative flex min-h-screen transition-colors duration-300 w-full max-w-full overflow-x-hidden ${
        theme === "dark" 
          ? "bg-[#0A0A0F] text-white" 
          : "bg-white text-gray-900"
      }`}>
      {/* Background pattern */}
    {theme === "dark" && (
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30" />
    )}
    
    {/* Animated gradient orbs */}
    {theme === "dark" && (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon" />
      </div>
    )}
    
    {/* Desktop Sidebar */}
    <Sidebar />
    
    {/* Mobile Drawer */}
    <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    
    <div className="flex flex-1 flex-col relative z-10 w-full max-w-full overflow-x-hidden lg:w-auto">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <main className={`flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-5 sm:py-6 lg:px-12 lg:py-8 transition-colors duration-300 w-full max-w-full ${
        theme === "dark" ? "bg-[#0A0A0F]" : "bg-white"
      }`} style={{ paddingBottom: "calc(6.5rem + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto w-full max-w-full space-y-5 sm:space-y-6 lg:space-y-8 pb-28 sm:pb-20 lg:pb-16 animate-fade-in overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  </div>
    </>
  );
};

export default RootLayout;
