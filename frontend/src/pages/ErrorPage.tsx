import { message } from "antd";
import errorGIF from "/oops.gif";

type props = {
  messageText: string;
};

export const ErrorPage = ({ messageText }: props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: "error",
      content: messageText,
    });
  };

  return (
    <>
      {contextHolder}
      <section onLoad={error}>
        <h1>Sorry, looks like we encountered an error</h1>
        <img src={errorGIF} alt="" width={600} />
      </section>
    </>
  );
};
