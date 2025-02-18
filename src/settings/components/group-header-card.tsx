import {
  Card,
  CardHeader,
  Subtitle1,
} from "@fluentui/react-components";
import { ReactNode } from "react";

function GroupHeaderCard({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader header={<Subtitle1>{header}</Subtitle1>} />
      {children}
    </Card>
  );
}

export default GroupHeaderCard;
