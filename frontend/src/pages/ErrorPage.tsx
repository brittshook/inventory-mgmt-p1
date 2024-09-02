import errorGIF from "/oops.gif";
import { ErrorOverlay } from "../components/ErrorOverlay";

type props = {
  messageText?: string;
  testId?: string;
};

export const ErrorPage = ({ messageText, testId }: props) => {
  return (
    <section data-testid={testId}>
      <h1>Sorry, looks like we encountered an error</h1>
      <img src={errorGIF} alt="" width={600} />
      {messageText && (
        <div data-testid="error-overlay">
          <ErrorOverlay messageText={messageText} />
        </div>
      )}
    </section>
  );
};
