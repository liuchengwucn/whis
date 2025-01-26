import { Button } from "@fluentui/react-components";
import { OpenSubtitleButton, OpenVideoButton } from "./open-button";

function NavigationBar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <div>
        <p className="font-bold text-inherit">whis</p>
      </div>
      <div className="flex gap-4">
        <OpenVideoButton size="small" />
        <OpenSubtitleButton size="small" />
        <Button size="small">Save</Button>
      </div>
      <div>
        <Button appearance="primary">Open in Aegisub</Button>
      </div>
    </nav>
  );
}

export default NavigationBar;
