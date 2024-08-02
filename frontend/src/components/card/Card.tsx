import React from "react";
import { Card as CardElement, Dropdown } from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./Card.css";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";

type props = {
  title: string;
  subtitle?: string;
  loaded: boolean;
  path: string;
  deleteItem: (id: number) => Promise<void>;
  id: number;
};

// TODO: use modal to confirm before delete

export const Card = ({
  title,
  subtitle,
  loaded,
  path,
  deleteItem,
  id,
}: props) => {
  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "delete") {
      try {
        await deleteItem(id);
        console.log("Item deleted");
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Delete",
      key: "delete",
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const actions: React.ReactNode[] = [
    <EditOutlined key="edit" />,
    <Dropdown menu={menuProps}>
      <EllipsisOutlined key="ellipsis" />
    </Dropdown>,
  ];

  
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
