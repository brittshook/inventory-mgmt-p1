import { useState } from "react";

type props = {
  section: string;
};

export const SkipNavigation = ({ section }: props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <a
        id="skip-nav"
        href={section}
        className={!isFocused ? "visually-hidden" : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        Skip to main content
      </a>
    </div>
  );
};
