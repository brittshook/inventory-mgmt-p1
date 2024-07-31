import React from "react";
import { Card as CardElement } from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./Card.css";
import { Link } from "react-router-dom";

type props = {
  title: string;
  subtitle?: string;
  loaded: boolean;
  path: string;
};

const actions: React.ReactNode[] = [
  <EditOutlined key="edit" />,
  <EllipsisOutlined key="ellipsis" />,
];

export const Card = ({ title, subtitle, loaded, path }: props) => {
  return (
    <>
      <CardElement loading={loaded} actions={actions}>
        <Link to={path}>
          <CardElement.Meta title={title} description={subtitle} />
        </Link>
      </CardElement>
    </>
  );
};
