import { ReactElement } from "react";
import { Breadcrumb as BreadcrumbNav } from "antd";
import "./Breadcrumb.css";

type props = {
  items: { href?: string; title: ReactElement | string }[];
};

export const Breadcrumb = ({ items }: props) => {
  return <BreadcrumbNav separator=">" items={items} />;
};
