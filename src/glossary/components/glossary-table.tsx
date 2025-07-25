import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Field,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
} from "@fluentui/react-components";
import {
  Delete24Regular,
  Edit24Regular,
  ArrowDownload24Regular,
  ArrowUpload24Regular,
} from "@fluentui/react-icons";
import { GlossaryItem } from "../../lib/types";

interface GlossaryTableProps {
  items: GlossaryItem[];
  onEdit: (item: GlossaryItem) => void;
  onDelete: (id: string) => void;
}

export function GlossaryTable({ items, onEdit, onDelete }: GlossaryTableProps) {
  return (
    <Table arial-label="词汇表" className="overflow-auto">
      <TableHeader>
        <TableRow>
          <TableHeaderCell className="max-w-48">原文</TableHeaderCell>
          <TableHeaderCell className="max-w-48">译文</TableHeaderCell>
          <TableHeaderCell className="max-w-64">解释</TableHeaderCell>
          <TableHeaderCell className="max-w-24">操作</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="max-w-48">
              <TableCellLayout className="truncate" title={item.original}>
                {item.original}
              </TableCellLayout>
            </TableCell>
            <TableCell className="max-w-48">
              <TableCellLayout className="truncate" title={item.translation}>
                {item.translation}
              </TableCellLayout>
            </TableCell>
            <TableCell className="max-w-64">
              <TableCellLayout
                className="truncate"
                title={item.explanation || "-"}
              >
                {item.explanation || "-"}
              </TableCellLayout>
            </TableCell>
            <TableCell className="max-w-24">
              <TableCellLayout>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<Edit24Regular />}
                    onClick={() => onEdit(item)}
                  />
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    onClick={() => onDelete(item.id)}
                  />
                </div>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface AddEditDialogProps {
  item?: GlossaryItem;
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<GlossaryItem, "id">) => void;
}

export function AddEditDialog({
  item,
  open,
  onClose,
  onSave,
}: AddEditDialogProps) {
  const [original, setOriginal] = useState(item?.original || "");
  const [translation, setTranslation] = useState(item?.translation || "");
  const [explanation, setExplanation] = useState(item?.explanation || "");

  React.useEffect(() => {
    if (item) {
      setOriginal(item.original);
      setTranslation(item.translation);
      setExplanation(item.explanation || "");
    } else {
      setOriginal("");
      setTranslation("");
      setExplanation("");
    }
  }, [item, open]);

  const handleSave = () => {
    if (original.trim() && translation.trim()) {
      onSave({
        original: original.trim(),
        translation: translation.trim(),
        explanation: explanation.trim() || undefined,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
        <DialogTitle>{item ? "编辑词汇" : "添加词汇"}</DialogTitle>
        <DialogContent>
          <DialogBody>
            <div className="space-y-4">
              <Field label="原文" required>
                <Input
                  value={original}
                  onChange={(_, data) => setOriginal(data.value)}
                  placeholder="输入原文"
                />
              </Field>
              <Field label="译文" required>
                <Input
                  value={translation}
                  onChange={(_, data) => setTranslation(data.value)}
                  placeholder="输入译文"
                />
              </Field>
              <Field label="解释（可选）">
                <Textarea
                  value={explanation}
                  onChange={(_, data) => setExplanation(data.value)}
                  placeholder="输入解释"
                  rows={3}
                />
              </Field>
            </div>
          </DialogBody>
          <DialogActions className="flex justify-end">
            <Button appearance="secondary" onClick={onClose}>
              取消
            </Button>
            <Button
              appearance="primary"
              onClick={handleSave}
              disabled={!original.trim() || !translation.trim()}
            >
              保存
            </Button>
          </DialogActions>
        </DialogContent>
      </DialogSurface>
    </Dialog>
  );
}

interface ImportExportButtonsProps {
  onExport: () => void;
  onImport: () => void;
}

export function ImportExportButtons({
  onExport,
  onImport,
}: ImportExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button icon={<ArrowDownload24Regular />} onClick={onImport}>
        导入
      </Button>
      <Button icon={<ArrowUpload24Regular />} onClick={onExport}>
        导出
      </Button>
    </div>
  );
}
