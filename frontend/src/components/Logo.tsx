import logoFull from "/logo.webp";
import logoShort from "/logo_short.webp";

type props = {
  type: "full" | "short";
};

export const Logo = ({ type }: props) => {
  return (
    <header>
      <img
        id="logo"
        src={type == "full" ? logoFull : logoShort}
        alt="Crag Supply Co."
        title="Crag Supply Co."
      />
    </header>
  );
};
