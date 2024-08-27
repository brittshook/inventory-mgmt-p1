import logoFull from "/logo.webp";
import logoShort from "/logo_short.webp";

type props = {
  type: "full" | "short";
  testId?: string;
};

export const Logo = ({ type, testId }: props) => {
  return (
    <header>
      <img
        id={`${type}-logo`}
        data-testid={testId}
        src={type == "full" ? logoFull : logoShort}
        alt="Crag Supply Co."
        title="Crag Supply Co."
      />
    </header>
  );
};
