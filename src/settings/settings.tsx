import { Divider, Title1 } from "@fluentui/react-components";
import {
  Translate24Regular,
  LocalLanguage24Regular,
  LinkMultiple24Regular,
  Key24Regular,
  PersonChat24Regular,
  Box24Regular,
  FastAcceleration24Regular,
} from "@fluentui/react-icons";
import GroupHeaderCard from "./components/group-header-card";
import SettingCard from "./components/setting-card";
import SelectSettingCard from "./components/select-setting-card";
import FileSettingCard from "./components/file-setting-card";
import { languageDisplay, languages } from "../lib/ai-utils";

function Settings() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Title1 as="h1" className="px-2">
        偏好设定
      </Title1>
      <GroupHeaderCard header="AI参数">
        <SettingCard
          title="Base URL"
          description="兼容OpenAI API接口"
          icon={<LinkMultiple24Regular />}
          field="base-url"
          placeholder="https://api.openai.com/v1"
        />
        <Divider />
        <SettingCard
          title="API Key"
          description="OpenAI API密钥"
          icon={<Key24Regular />}
          field="api-key"
          placeholder="sk-1234567890abcdef"
        />
        <Divider />
        <SettingCard
          title="模型名称"
          description="需要使用的大语言模型"
          icon={<PersonChat24Regular />}
          field="model-name"
          placeholder="gpt-4o-mini"
        />
        <Divider />
        <FileSettingCard
          title="Whisper模型"
          description="兼容ggml格式的Whisper模型"
          icon={<Box24Regular />}
          field="whisper-model-path"
        />
        <Divider />
        <SelectSettingCard
          title="Whisper GPU加速"
          description="推荐Apple Silicon用户和Nvidia GPU用户开启"
          icon={<FastAcceleration24Regular />}
          field="whisper-use-gpu"
          defaultOption="true"
          optionDisplay={{ true: "开启", false: "关闭" }}
          options={["true", "false"]}
        />
      </GroupHeaderCard>
      <GroupHeaderCard header="语言设置">
        <SelectSettingCard
          title="源语言"
          description="视频的原始语言"
          icon={<Translate24Regular />}
          field="source-language"
          defaultOption="ja"
          optionDisplay={languageDisplay}
          options={languages}
        />
        <Divider />
        <SelectSettingCard
          title="目标语言"
          description="翻译的目标语言"
          icon={<LocalLanguage24Regular />}
          field="target-language"
          defaultOption="zh"
          optionDisplay={languageDisplay}
          options={languages}
        />
      </GroupHeaderCard>
    </div>
  );
}

export default Settings;
