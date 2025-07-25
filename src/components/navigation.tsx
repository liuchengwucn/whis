import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tab, TabList, Hamburger } from "@fluentui/react-components";
import { MouseEvent } from "react";

import {
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  bundleIcon,
  Settings20Filled,
  Settings20Regular,
  Translate20Filled,
  Translate20Regular,
  BookGlobe20Filled,
  BookGlobe20Regular,
} from "@fluentui/react-icons";

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);
const EditorIcon = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
);
const TranslateIcon = bundleIcon(Translate20Filled, Translate20Regular);
const GlossaryIcon = bundleIcon(BookGlobe20Filled, BookGlobe20Regular);

function Navigation() {
  const location = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    navigate(e.currentTarget.value);
  };

  return (
    <nav className="p-1">
      <div className="px-1">
        <Hamburger onClick={() => setIsOpen(!isOpen)} />
      </div>

      <TabList selectedValue={location} vertical>
        <Tab icon={<EditorIcon />} value="/editor" onClick={handleClick}>
          {isOpen ? "字幕编辑" : ""}
        </Tab>
        <Tab
          icon={<TranslateIcon />}
          value="/translation-prompt"
          onClick={handleClick}
        >
          {isOpen ? "提示词" : ""}
        </Tab>
        <Tab icon={<GlossaryIcon />} value="/glossary" onClick={handleClick}>
          {isOpen ? "词汇表" : ""}
        </Tab>
        <Tab icon={<SettingsIcon />} value="/settings" onClick={handleClick}>
          {isOpen ? "偏好设定" : ""}
        </Tab>
      </TabList>
    </nav>
  );
}

export default Navigation;
