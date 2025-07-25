import { useState, useEffect } from "react";
import {
  Text,
  Button,
  Card,
  Title1,
  useToastController,
  Toast,
  ToastTitle,
  ToastIntent,
} from "@fluentui/react-components";
import { Add24Regular } from "@fluentui/react-icons";
import { GlossaryItem, Glossary } from "../lib/types";
import {
  getGlossary,
  addGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
  exportGlossary,
  importGlossary,
} from "../lib/glossary-utils";
import {
  GlossaryTable,
  AddEditDialog,
  ImportExportButtons,
} from "./components/glossary-table";
import { confirm, save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";

function GlossaryPage() {
  const [glossary, setGlossary] = useState<Glossary>({
    name: "默认词汇表",
    items: [],
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GlossaryItem | undefined>();
  const { dispatchToast } = useToastController();

  useEffect(() => {
    loadGlossary();
  }, []);

  const loadGlossary = async () => {
    try {
      const data = await getGlossary();
      setGlossary(data);
    } catch (error) {
      showToast("加载词汇表失败", "error");
    }
  };

  const showToast = (message: string, intent: ToastIntent = "success") => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent },
    );
  };

  const handleAdd = async (item: Omit<GlossaryItem, "id">) => {
    try {
      await addGlossaryItem(item);
      await loadGlossary();
      showToast("添加成功");
    } catch (error) {
      showToast("添加失败", "error");
    }
  };

  const handleEdit = (item: GlossaryItem) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updates: Omit<GlossaryItem, "id">) => {
    if (!editingItem) return;

    try {
      await updateGlossaryItem(editingItem.id, updates);
      await loadGlossary();
      setEditingItem(undefined);
      showToast("更新成功");
    } catch (error) {
      showToast("更新失败", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirm("确定要删除这个词汇吗？")) {
      try {
        await deleteGlossaryItem(id);
        await loadGlossary();
        showToast("删除成功");
      } catch (error) {
        showToast("删除失败", "error");
      }
    }
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportGlossary();
      const filePath = await save({
        defaultPath: `词汇表_${new Date().toISOString().split("T")[0]}.json`,
        filters: [{ name: "JSON 文件", extensions: ["json"] }],
      });
      if (!filePath) return;
      await writeTextFile(filePath, jsonData);
      showToast("导出成功");
    } catch (error) {
      showToast("导出失败", "error");
    }
  };

  const handleImport = async () => {
    try {
      const file = await open({
        title: "选择词汇表文件",
        filters: [{ name: "JSON 文件", extensions: ["json"] }],
      });
      if (!file) return;
      const text = await readTextFile(file);
      await importGlossary(text);
      await loadGlossary();
      showToast("导入成功");
    } catch (error) {
      showToast(`导入失败: ${(error as Error).message}`, "error");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 min-h-full">
      <Title1 as="h1" className="px-2">
        翻译词汇表
      </Title1>

      {/* Action Buttons */}

      <div className="flex items-center justify-end w-full">
        <div className="flex gap-2">
          <ImportExportButtons
            onExport={handleExport}
            onImport={handleImport}
          />
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={() => setShowAddDialog(true)}
          >
            添加词汇
          </Button>
        </div>
      </div>

      {/* Glossary Table */}
      <Card className="w-full">
        <div className="p-4 overflow-auto">
          {glossary.items.length > 0 ? (
            <GlossaryTable
              items={glossary.items}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8">
              <Text size={400} className="text-gray-500">
                暂无词汇，点击"添加词汇"开始创建词汇表
              </Text>
            </div>
          )}
        </div>
      </Card>

      {/* Add Dialog */}
      <AddEditDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleAdd}
      />

      {/* Edit Dialog */}
      <AddEditDialog
        item={editingItem}
        open={!!editingItem}
        onClose={() => setEditingItem(undefined)}
        onSave={handleUpdate}
      />
    </div>
  );
}

export default GlossaryPage;