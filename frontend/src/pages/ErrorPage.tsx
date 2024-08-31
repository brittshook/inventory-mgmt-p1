import { message } from "antd";
import errorGIF from "/oops.gif";
import { useEffect } from "react";

type props = {
  messageText: string;
};

export const ErrorPage = ({ messageText }: props) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    messageApi.open({
      type: "error",
      content: messageText,
    });
  }, [messageApi, messageText]);

  return (
    <>
      {contextHolder}
      <section>
        <h1>Sorry, looks like we encountered an error</h1>
        <img src={errorGIF} alt="" width={600} />
      </section>
    </>
  );
};
