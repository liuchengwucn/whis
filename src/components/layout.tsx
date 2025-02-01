import {
  Hamburger,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  OnNavItemSelectData,
} from "@fluentui/react-nav-preview";

import { Toaster, Tooltip } from "@fluentui/react-components";

import {
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  bundleIcon,
  Settings20Filled,
  Settings20Regular,
  History20Filled,
  History20Regular,
  Chat20Filled,
  Chat20Regular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);
const EditorIcon = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular
);
const ChatIcon = bundleIcon(Chat20Filled, Chat20Regular);
const RecentProjectsIcon = bundleIcon(History20Filled, History20Regular);

const pathArray = ["/settings", "/recent", "/", "/chat"];

function Layout() {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    pathArray.indexOf(location).toString()
  );

  const HamburgerWithToolTip = () => {
    return (
      <Tooltip content="Navigation" relationship="label">
        <Hamburger onClick={() => setIsOpen(!isOpen)} />
      </Tooltip>
    );
  };

  const handleItemSelect = (
    _: Event | React.SyntheticEvent<Element, Event>,
    data: OnNavItemSelectData
  ) => {
    setSelectedValue(data.value as string);
  };

  return (
    <div>
      <NavDrawer
        open={isOpen}
        selectedValue={selectedValue}
        onNavItemSelect={handleItemSelect}
      >
        <NavDrawerHeader>
          <HamburgerWithToolTip />
        </NavDrawerHeader>

        <NavDrawerBody>
          <NavItem href="/recent" icon={<RecentProjectsIcon />} value="1">
            Recent Projects
          </NavItem>
          <NavItem href="/" icon={<EditorIcon />} value="2">
            Editor
          </NavItem>
          <NavItem href="chat" icon={<ChatIcon />} value="3">
            Chat
          </NavItem>
          <NavDivider />
          <NavItem href="/settings" icon={<SettingsIcon />} value="0">
            Settings
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <div className="flex">
        <div className="px-3 py-1">
          <HamburgerWithToolTip />
        </div>
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
}

export default Layout;
