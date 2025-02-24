import { useEffect, useState } from "react";
import {
  Body1Strong,
  Button,
  Caption1,
  CardHeader,
  Input,
} from "@fluentui/react-components";
import { load } from "@tauri-apps/plugin-store";
import { open } from "@tauri-apps/plugin-dialog";

function FileSettingCard({
  title,
  description,
  field,
  icon,
}: {
  title: string;
  description: string;
  field: string;
  icon: any;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    load("store.json").then((store) => {
      store.get(field).then((value) => {
        if (value) {
          setValue(value as string);
        }
      });
    });

    return () => {
      setValue("");
    };
  }, []);

  async function openFile() {
    const result = await open({
      title: "Select your Whisper model",
      filters: [{ name: "Whisper Models", extensions: ["bin"] }],
    });
    if (!result) return;

    setValue(result);
    const store = await load("store.json");
    await store.set(field, result);
  }

  return (
    <CardHeader
      header={<Body1Strong>{title}</Body1Strong>}
      description={<Caption1>{description}</Caption1>}
      image={icon}
      action={
        <div className="flex w-64 justify-between">
          <Input value={value} className="w-38"/>
          <Button onClick={openFile} appearance="primary" className="w-20">
            Open
          </Button>
        </div>
      }
    />
  );
}

export default FileSettingCard;
