import { Button as ButtonElement } from "antd";

type props = {
  type?: "primary";
  children: string;
  disabled?: boolean;
  testId?: string;
};

export const Button = ({ children, type, disabled, testId }: props) => {
  return (
    <ButtonElement data-testid={testId} type={type} disabled={disabled}>
      {children}
    </ButtonElement>
  );
};
