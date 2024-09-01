import errorGIF from "/oops.gif";
import { ErrorOverlay } from "../components/ErrorOverlay";

type props = {
  messageText: string;
};

export const ErrorPage = ({ messageText }: props) => {
  return (
    <>
      <ErrorOverlay messageText={messageText} />
      <section>
        <h1>Sorry, looks like we encountered an error</h1>
        <img src={errorGIF} alt="" width={600} />
      </section>
    </>
  );
};
