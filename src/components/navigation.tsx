import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tab, TabList, ToggleButton } from "@fluentui/react-components";
import { MouseEvent } from "react";

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
  CalendarAgenda20Filled,
  CalendarAgenda20Regular,
} from "@fluentui/react-icons";

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);
const EditorIcon = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular
);
const ChatIcon = bundleIcon(Chat20Filled, Chat20Regular);
const RecentIcon = bundleIcon(History20Filled, History20Regular);

function Navigation() {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    navigate(e.currentTarget.value);
  };

  return (
    <nav className="px-1">
      <div className="px-1">
        <ToggleButton
          checked={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          icon={
            isOpen ? <CalendarAgenda20Filled /> : <CalendarAgenda20Regular />
          }
          appearance="transparent"
        />
      </div>

      <TabList selectedValue={location} vertical>
        <Tab icon={<RecentIcon />} value="/recent" onClick={handleClick}>
          {isOpen ? "Recent" : ""}
        </Tab>
        <Tab icon={<EditorIcon />} value="/editor" onClick={handleClick}>
          {isOpen ? "Editor" : ""}
        </Tab>
        <Tab icon={<ChatIcon />} value="/chat" onClick={handleClick}>
          {isOpen ? "Chat" : ""}
        </Tab>
        <Tab icon={<SettingsIcon />} value="/settings" onClick={handleClick}>
          {isOpen ? "Settings" : ""}
        </Tab>
      </TabList>
    </nav>
  );
}

export default Navigation;
