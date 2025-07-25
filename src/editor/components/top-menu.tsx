import { Button } from "@fluentui/react-components";
import { OpenSubtitleButton, OpenVideoButton } from "./open-button";
import SaveButton from "./save-button";

function TopMenu() {
  return (
    <nav className="flex justify-between items-center">
      <div>
        <p className="font-bold text-inherit">whis</p>
      </div>
      <div className="flex gap-4">
        <OpenVideoButton size="small" />
        <OpenSubtitleButton size="small" />
        <SaveButton size="small" />
      </div>
      <div>
        <Button appearance="primary">在Aegisub中打开</Button>
      </div>
    </nav>
  );
}

export default TopMenu;
