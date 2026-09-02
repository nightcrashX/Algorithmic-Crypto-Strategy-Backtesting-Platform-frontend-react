import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#05080e] text-slate-200">
      {/* 3D Ambient Lighting Effect in Background */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-full w-[240px] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport Shell */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMobileMenu={() => setMobileOpen(true)} />

        <main className="relative min-h-0 flex-1 overflow-auto p-2.5 sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
