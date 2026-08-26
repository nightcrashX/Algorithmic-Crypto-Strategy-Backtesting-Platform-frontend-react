import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#070a0f]">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
