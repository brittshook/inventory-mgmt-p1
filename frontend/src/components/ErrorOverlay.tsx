import { message } from "antd";
import { useEffect } from "react";

type Props = {
  messageText: string;
};

export const ErrorOverlay = ({ messageText }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    messageApi.open({
      type: "error",
      content: messageText,
    });
  }, [messageApi, messageText]);

  return <>{contextHolder}</>;
};