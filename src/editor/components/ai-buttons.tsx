import { Button } from "@fluentui/react-components";
import { MicRegular, SendCopyRegular, TranslateRegular } from "@fluentui/react-icons";

export function MicButton() {
  return <Button icon={<MicRegular />} size="small" />;
}
export function TransButton() {
  return <Button icon={<TranslateRegular />} size="small" />;
}
export function CopyButton() {
  return <Button icon={<SendCopyRegular />} size="small" />;
}
