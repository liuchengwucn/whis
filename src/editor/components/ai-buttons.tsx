import {
  Button,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import {
  MicRegular,
  SendCopyRegular,
  TranslateRegular,
} from "@fluentui/react-icons";
import {
  transcribeCurrentLine,
  queryTranslation,
  copyTranslationToSubtitle,
} from "../../lib/ai-utils";

export function MicButton() {
  const { dispatchToast } = useToastController();

  const handleTranscribe = async () => {
    await transcribeCurrentLine();
    dispatchToast(
      <Toast>
        <ToastTitle>转写成功</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  };

  return (
    <Button icon={<MicRegular />} size="small" onClick={handleTranscribe} />
  );
}

export function TransButton() {
  const { dispatchToast } = useToastController();

  const handleTranslate = async () => {
    await queryTranslation();
    dispatchToast(
      <Toast>
        <ToastTitle>翻译成功</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  };

  return (
    <Button
      icon={<TranslateRegular />}
      size="small"
      onClick={handleTranslate}
    />
  );
}
export function CopyButton() {
  const { dispatchToast } = useToastController();

  const handleCopy = () => {
    copyTranslationToSubtitle();
    dispatchToast(
      <Toast>
        <ToastTitle>复制成功</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  };

  return (
    <Button icon={<SendCopyRegular />} size="small" onClick={handleCopy} />
  );
}
