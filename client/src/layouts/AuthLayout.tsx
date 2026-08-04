import { Outlet } from "react-router-dom";
import Logo from "../assets/logo.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between px-16 py-12">

        {/* Top Branding */}
        <div className="flex items-center gap-3 lg:gap-0">
          <img
            src={Logo}
            alt="Plinth Logo"
            className="w-8 h-8 lg:w-18 lg:h-18 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">
            Plinth
          </span>
        </div>

        {/* Hero Content */}
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Manage clients.
            <br />
            Deliver projects.
            <br />
            Stay productive.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Plinth helps freelancers and small teams organize
            projects and tasks in one focused workspace.
          </p>
        </div>

        {/* Footer Micro Copy */}
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} WorkPilot
        </div>

      </div>

      {/* Right Auth Area */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12">

        <div className="w-full max-w-md">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AuthLayout;