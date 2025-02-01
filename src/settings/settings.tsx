import {
  Button,
  Input,
  Label,
  Title1,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";

function Settings() {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { dispatchToast } = useToastController();

  useEffect(() => {
    load("store.json").then((store) => {
      store.get("base-url").then((url) => {
        if (url) {
          setBaseUrl(url as string);
        }
      });
      store.get("api-key").then((key) => {
        if (key) {
          setApiKey(key as string);
        }
      });
    });

    return () => {
      setBaseUrl("");
      setApiKey("");
    };
  }, []);

  const saveSettings = async () => {
    const store = await load("store.json");

    await store.set("base-url", baseUrl);
    await store.set("api-key", apiKey);

    dispatchToast(
      <Toast>
        <ToastTitle>Settings saved successfully</ToastTitle>
      </Toast>,
      { intent: "success" }
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Title1 as="h1">Settings</Title1>
      <Label className="flex flex-col gap-0.5">
        Base URL
        <Input
          placeholder=""
          value={baseUrl}
          onChange={(e) => {
            setBaseUrl(e.target.value);
          }}
        />
      </Label>
      <Label className="flex flex-col gap-0.5">
        API Key
        <Input
          placeholder=""
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
      </Label>
      <Button appearance="primary" onClick={saveSettings}>
        Save
      </Button>
    </div>
  );
}

export default Settings;
