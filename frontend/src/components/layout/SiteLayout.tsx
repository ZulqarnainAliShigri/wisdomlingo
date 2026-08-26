import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileCallBar } from "./MobileCallBar";
import { WhatsAppWidget } from "./WhatsAppWidget";

export const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // The bottom padding keeps the footer clear of the fixed mobile call bar.
  <div className="flex min-h-screen flex-col pb-[4.75rem] lg:pb-0">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <MobileCallBar />
    <WhatsAppWidget />
  </div>
);
