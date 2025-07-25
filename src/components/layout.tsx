import { Toaster } from "@fluentui/react-components";
import { Outlet } from "react-router";
import Navigation from "./navigation";

function Layout() {
  return (
    <div>
      <div className="flex h-screen">
        <div className="h-screen bg-neutral-100 flex-shrink-0">
          <Navigation />
        </div>
        <div className="h-screen flex-1 bg-neutral-50 overflow-auto">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </div>
  );
}

export default Layout;
