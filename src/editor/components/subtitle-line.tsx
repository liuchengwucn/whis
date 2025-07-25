import { useEffect, useState } from "react";
import { useEditorStore } from "../../lib/stores";
import { stringifyTime } from "../../lib/utils";
import { TableCell, TableRow } from "@fluentui/react-components";
import { ParsedASSEvent } from "ass-compiler";

function SubtitleLine({ lineNumber }: { lineNumber: number }) {
  const [lineState, setLineState] = useState<ParsedASSEvent>();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe(
      (state) => {
        return state.lines()[lineNumber];
      },
      (line) => {
        setLineState(line);
      },
      { fireImmediately: true },
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
      { fireImmediately: true },
    );
    return unsubscribe;
  }, []);

  return (
    <TableRow
      onClick={async () => {
        const currentState = useEditorStore.getState();
        if (currentState.currentLine === lineNumber) {
          // If clicking the same line, trigger replay
          currentState.playCurrentLine();
        } else {
          // If clicking a different line, set new current line
          currentState.setCurrentLineWithCache(lineNumber);
        }
      }}
      appearance={selected ? "brand" : "none"}
    >
      <TableCell className="max-w-16">{lineNumber}</TableCell>
      <TableCell className="max-w-32">
        {stringifyTime(lineState?.Start)}
      </TableCell>
      <TableCell className="max-w-32">
        {stringifyTime(lineState?.End)}
      </TableCell>
      <TableCell className="max-w-16">
        {Math.round(
          (lineState?.Text.raw.length ?? 0) /
            ((lineState?.End ?? 0) - (lineState?.Start ?? 0) || 1),
        )}
      </TableCell>
      <TableCell className="max-w-32">{lineState?.Style}</TableCell>
      <TableCell className="text-nowrap overflow-hidden overflow-ellipsis">
        {lineState?.Text.raw}
      </TableCell>
    </TableRow>
  );
}

export default SubtitleLine;
