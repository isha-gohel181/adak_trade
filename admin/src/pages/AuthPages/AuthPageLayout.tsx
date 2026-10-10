import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="relative flex flex-col min-h-screen lg:h-screen lg:flex-row dark:bg-gray-950">
        {/* Left Side: Form container */}
        <div className="flex flex-col justify-center flex-1 w-full p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {children}
        </div>

        {/* Right Side: Brand Banner (Full Height) */}
        <div className="relative items-center justify-center hidden w-full lg:w-1/2 min-h-screen lg:min-h-full bg-gradient-to-br from-[#047857] via-[#026AA2] to-[#063A5B] dark:bg-gradient-to-br dark:from-[#063A5B] dark:via-[#03253C] dark:to-gray-950 lg:flex overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-20 -right-20 pointer-events-none"></div>
          <div className="absolute w-80 h-80 bg-[#36bffa]/20 rounded-full blur-3xl -bottom-20 -left-20 pointer-events-none"></div>

          <div className="relative flex items-center justify-center z-1 w-full max-w-md px-8">
            <GridShape />
            <div className="flex flex-col items-center text-center">
              <Link to="/" className="block mb-6 group transition-transform duration-300 hover:scale-105">
                <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-2xl ring-4 ring-white/20 flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain"
                    src="/images/logo/logo-icon.svg"
                    alt="IAS"
                  />
                </div>
              </Link>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                Institute Of Applied Statistics
              </h2>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-3">
                Admin &amp; Management Portal
              </div>
              <p className="text-sm text-white/80 max-w-xs leading-relaxed">
                Centralized Course &amp; Learning Management Dashboard
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
