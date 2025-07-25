import { useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Toast,
  ToastTitle,
  Title1,
  useToastController,
} from "@fluentui/react-components";
import { defaultPrompt } from "../lib/ai-utils";
import { load } from "@tauri-apps/plugin-store";

function TranslationPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { dispatchToast } = useToastController();

  // Load the current prompt on component mount
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const store = await load("store.json");
        const savedPrompt = await store.get("translation-prompt");
        if (savedPrompt) {
          setPrompt(savedPrompt as string);
        } else {
          // Set default prompt if none exists
          setPrompt(defaultPrompt);
        }
      } catch (error) {
        console.error("Failed to load translation prompt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrompt();
  }, []);

  const handleSave = async () => {
    try {
      const store = await load("store.json");
      await store.set("translation-prompt", prompt);
      dispatchToast(
        <Toast>
          <ToastTitle>翻译提示词保存成功</ToastTitle>
        </Toast>,
        { intent: "success" },
      );
    } catch (error) {
      console.error("Failed to save translation prompt:", error);
      dispatchToast(
        <Toast>
          <ToastTitle>保存失败</ToastTitle>
        </Toast>,
        { intent: "error" },
      );
    }
  };

  const handleReset = () => {
    setPrompt(defaultPrompt);
  };

  if (isLoading) {
    return <div className="p-4">加载中...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Title1 as="h1" className="px-2">
        翻译提示词配置
      </Title1>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          自定义翻译时使用的AI提示词。可使用以下占位符：
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>
            <code>{"{sourceLanguage}"}</code> - 源语言名称
          </li>
          <li>
            <code>{"{targetLanguage}"}</code> - 目标语言名称
          </li>
          <li>
            <code>{"{transcription}"}</code> - 转写的文本内容
          </li>
          <li>
            <code>{"{glossary}"}</code> - 词汇表（可选）
          </li>
          <li>
            <code>{"{context}"}</code> - 前面5条字幕的上下文
          </li>
        </ul>
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
        className="w-full"
        placeholder="输入您的翻译提示词..."
      />

      <div className="flex justify-end space-x-2 mt-4 gap-2">
        <Button appearance="secondary" onClick={handleReset}>
          恢复默认
        </Button>
        <Button appearance="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
    </div>
  );
}

export default TranslationPromptPage;
