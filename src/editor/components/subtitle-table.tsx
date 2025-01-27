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

const columns = [
  ["#", "max-w-16"],
  ["Start", "max-w-32"],
  ["End", "max-w-32"],
  ["CPS", "max-w-16"],
  ["Style", "max-w-32"],
  ["Text", ""],
];

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
    <Table noNativeElements size="small" className="overflow-auto px-4">
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column[0]} className={column[1]}>
              {column[0]}
            </TableHeaderCell>
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
