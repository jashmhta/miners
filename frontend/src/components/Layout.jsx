import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 font-black text-sm tracking-wide border-b-[3px]",
        active ? "text-orange-500 border-orange-500" : "text-gray-300 border-transparent hover:text-white hover:border-gray-600"
      )}
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-tighter">
            <span className="text-white">BRUTE</span>
            <span className="text-orange-500">OSAUR</span>
          </Link>
          <nav className="flex items-center space-x-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/demo">Demo</NavLink>
            <NavLink to="/compatibility">Compatibility</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>
      <main className="pt-16">{children}</main>
      <footer className="border-t-4 border-gray-800 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Bruteosaur. All rights reserved.
          </div>
          <div className="flex items-center gap-6 font-bold">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/compatibility" className="hover:text-white">Compatibility</Link>
            <a href="#top" className="hover:text-white">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}