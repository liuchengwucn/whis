import { Toaster } from "@fluentui/react-components";
import { Outlet } from "react-router";
import Navigation from "./navigation";

function Layout() {
  return (
    <div>
      <div className="flex">
        <div className="h-screen bg-neutral-100">
          <Navigation />
        </div>
        <div className="h-screen grow bg-neutral-50">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </div>
  );
}

export default Layout;
