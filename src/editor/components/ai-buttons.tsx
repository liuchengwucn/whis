import { Button } from "@fluentui/react-components";
import {
  MicRegular,
  SendCopyRegular,
  TranslateRegular,
} from "@fluentui/react-icons";
import { invoke } from "@tauri-apps/api/core";
import { useEditorStore } from "../../lib/stores";

export function MicButton() {
  return <Button icon={<MicRegular />} size="small" />;
}
export function TransButton() {
  const transcription = useEditorStore((state) => state.transcription);

  const translate = () => {
    invoke("query_llm", { value: transcription }).then((message) => {
      useEditorStore.setState({ translation: message as string });
    });
  };
  return (
    <Button icon={<TranslateRegular />} size="small" onClick={translate} />
  );
}
export function CopyButton() {
  return <Button icon={<SendCopyRegular />} size="small" />;
}
