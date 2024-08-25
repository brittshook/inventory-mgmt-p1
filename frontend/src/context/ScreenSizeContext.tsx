import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

type ScreenSizeContextType = {
  isLargerThan1250: boolean;
  isSmallerThan900: boolean;
};

const ScreenSizeContext = createContext<ScreenSizeContextType | undefined>(
  undefined
);

const ScreenSizeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLargerThan1250, setIsLargerThan1250] = useState<boolean>(
    window.innerWidth > 1250
  );
  const [isSmallerThan900, setIsSmallerThan900] = useState<boolean>(
    window.innerWidth < 900
  );

  const handleResize = () => {
    setIsLargerThan1250(window.innerWidth > 1250);
    setIsSmallerThan900(window.innerWidth < 900);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial values

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isLargerThan1250, isSmallerThan900 }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

const useScreenSize = () => {
  const context = useContext(ScreenSizeContext);
  if (context === undefined) {
    throw new Error("useScreenSize must be used within a ScreenSizeProvider");
  }
  return context;
};

export { ScreenSizeProvider, useScreenSize };
