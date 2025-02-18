import { Divider, Title1 } from "@fluentui/react-components";
import GroupHeaderCard from "./components/group-header-card";
import SettingCard from "./components/setting-card";
import {
  Translate24Regular,
  LocalLanguage24Regular,
  LinkMultiple24Regular,
  Key24Regular,
  PersonChat24Regular,
} from "@fluentui/react-icons";
import SelectSettingCard from "./components/select-setting-card";

const languages = ["en-US", "zh-Hans", "zh-Hant", "ja-JP"];
const languageDisplay = {
  "en-US": "English",
  "zh-Hans": "Simplified Chinese",
  "zh-Hant": "Traditional Chinese",
  "ja-JP": "Japanese",
}

function Settings() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Title1 as="h1" className="px-2">
        Settings
      </Title1>
      <GroupHeaderCard header="AI Settings">
        <SettingCard
          title="Base URL"
          description="Compatible with the OpenAI Chat Completions API"
          icon={<LinkMultiple24Regular />}
          field="base-url"
          placeholder="https://api.openai.com/v1"
        />
        <Divider />
        <SettingCard
          title="API Key"
          description="Your OpenAI API key"
          icon={<Key24Regular />}
          field="api-key"
          placeholder="sk-1234567890abcdef"
        />
        <Divider />
        <SettingCard
          title="Model Name"
          description="The model to use for translations"
          icon={<PersonChat24Regular />}
          field="model-name"
          placeholder="gpt-4o-mini"
        />
      </GroupHeaderCard>
      <GroupHeaderCard header="Language Settings">
        <SelectSettingCard
          title="Source Language"
          description="The language to translate from"
          icon={<Translate24Regular />}
          field="source-language"
          defaultOption="ja-JP"
          optionDisplay={languageDisplay}
          options={languages}
        />
        <Divider />
        <SelectSettingCard
          title="Target Language"
          description="The language to translate to"
          icon={<LocalLanguage24Regular />}
          field="target-language"
          defaultOption="zh-Hans"
          optionDisplay={languageDisplay}
          options={languages}
        />
      </GroupHeaderCard>
    </div>
  );
}

export default Settings;
