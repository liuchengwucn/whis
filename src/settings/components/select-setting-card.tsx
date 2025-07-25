import { useEffect, useState } from "react";
import {
  Body1Strong,
  Caption1,
  CardHeader,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import { load } from "@tauri-apps/plugin-store";

function SelectSettingCard({
  title,
  description,
  field,
  defaultOption,
  options,
  optionDisplay,
  icon,
}: {
  title: string;
  description: string;
  field: string;
  defaultOption: string;
  options: string[];
  optionDisplay: Record<string, string>;
  icon: any;
}) {
  const [value, setValue] = useState(defaultOption);

  useEffect(() => {
    load("store.json").then((store) => {
      store.get(field).then((value) => {
        if (value) {
          setValue(value as string);
        }
      });
    });

    return () => {
      setValue(defaultOption);
    };
  }, []);

  return (
    <CardHeader
      header={<Body1Strong>{title}</Body1Strong>}
      description={<Caption1>{description}</Caption1>}
      image={icon}
      action={
        <div>
          <Dropdown
            value={optionDisplay[value]}
            onOptionSelect={async (_e, data) => {
              const newValue = data.optionValue ?? defaultOption;
              setValue(newValue);
              const store = await load("store.json");
              await store.set(field, newValue);
            }}
            className="w-64"
          >
            {options.map((option) => (
              <Option key={option} value={option}>
                {optionDisplay[option]}
              </Option>
            ))}
          </Dropdown>
        </div>
      }
    />
  );
}

export default SelectSettingCard;
