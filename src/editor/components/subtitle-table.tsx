import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useEditorStore } from "../../lib/store";
import SubtitleLine from "./subtitle-line";

const columns = ["#", "Start", "End", "Style", "Text", "Action"];

function SubtitleTable() {
  const [lineCount, setLineCount] = useState(0);
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe(
      (state) => {
        return state.lines().length;
      },
      (lineCount) => {
        setLineCount(lineCount);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <Table noNativeElements className="overflow-auto">
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column}>{column}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(lineCount).keys()].map((lineNumber) => (
          <SubtitleLine key={lineNumber} lineNumber={lineNumber} />
        ))}
      </TableBody>
    </Table>
  );
}

export default SubtitleTable;
