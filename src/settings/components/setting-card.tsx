import { useEffect, useState } from "react";
import {
  Body1Strong,
  Caption1,
  CardHeader,
  Input,
} from "@fluentui/react-components";
import { load } from "@tauri-apps/plugin-store";

function SettingCard({
  title,
  description,
  field,
  placeholder,
  icon,
}: {
  title: string;
  description: string;
  field: string;
  placeholder: string;
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

  return (
    <CardHeader
      header={<Body1Strong>{title}</Body1Strong>}
      description={<Caption1>{description}</Caption1>}
      image={icon}
      action={
        <Input
          className="w-64"
          placeholder={placeholder}
          value={value}
          onChange={async (e) => {
            setValue(e.target.value);
            const store = await load("store.json");
            await store.set(field, e.target.value);
          }}
        />
      }
    />
  );
}

export default SettingCard;
