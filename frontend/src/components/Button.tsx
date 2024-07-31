import { Button as ButtonElement } from "antd";

type props = {
  type?: "primary";
  children: string;
  icon?: string;
  disabled?: boolean;
};

export const Button = ({ children, type }: props) => {
  return <ButtonElement type={type}>{children}</ButtonElement>;
};
