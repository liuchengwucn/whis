import { useEffect, useState } from "react";
import { LineState, useEditorStore } from "../../lib/store";
import { Button, TableCell, TableRow } from "@fluentui/react-components";

function SubtitleLine({ lineNumber }: { lineNumber: number }) {
  const [lineState, setLineState] = useState<LineState>();
  const [selected, setSelected] = useState(false);
  const updateLine = useEditorStore((state) => state.updateLine);

  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe(
      (state) => {
        return state.lines()[lineNumber];
      },
      (line) => {
        setLineState(line);
      },
      { fireImmediately: true }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe(
      (state) => {
        return state.currentLine;
      },
      (line) => {
        if (line === lineNumber) {
          setSelected(true);
        } else if (line !== lineNumber) {
          setSelected(false);
        }
      },
      { fireImmediately: true }
    );
    return unsubscribe;
  }, []);

  return (
    <TableRow
      onClick={() => {
        useEditorStore.setState({ currentLine: lineNumber });
      }}
      appearance={selected ? "brand" : "none"}
    >
      <TableCell>{lineNumber + Math.random()}</TableCell>
      <TableCell>{lineState?.Start}</TableCell>
      <TableCell>{lineState?.End}</TableCell>
      <TableCell>{lineState?.Style}</TableCell>
      <TableCell>{lineState?.Text.raw}</TableCell>
      <TableCell>
        {
          <Button
            size="small"
            onClick={() => {
              updateLine(lineNumber, "New Text");
            }}
          >
            AI
          </Button>
        }
      </TableCell>
    </TableRow>
  );
}

export default SubtitleLine;
