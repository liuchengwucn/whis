import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import { useEditorStore } from "../../lib/stores";
import SubtitleLine from "./subtitle-line";

const columns = [
  ["#", "max-w-16"],
  ["开始时间", "max-w-32"],
  ["结束时间", "max-w-32"],
  ["字/秒", "max-w-16"],
  ["样式", "max-w-32"],
  ["文本", ""],
];

function SubtitleTable() {
  const lineCount = useEditorStore((state) => state.lines().length);

  return (
    <Table noNativeElements size="small" className="overflow-auto pt-4">
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
