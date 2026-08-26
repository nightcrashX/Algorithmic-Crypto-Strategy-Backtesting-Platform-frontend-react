import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // UI CHANGE: Added subtle app-shell depth while preserving existing routing/layout behavior.
    <div className="flex h-screen overflow-hidden bg-[#06090e] text-slate-200">

      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-full w-[236px]" onClick={(event) => event.stopPropagation()}>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">

        <Navbar onMobileMenu={() => setMobileOpen(true)} />

        <main className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_30%),#070a0f] p-3 md:p-4">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
