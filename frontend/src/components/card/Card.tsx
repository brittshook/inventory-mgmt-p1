import React, { ReactElement, useState } from "react";
import { Card as CardElement, Dropdown, Modal } from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./Card.css";
import { Link } from "react-router-dom";
import type { FormInstance, MenuProps } from "antd";

type props = {
  title: string;
  subtitle?: string;
  loaded: boolean;
  path: string;
  updateItem: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  id: number;
  editForm?: ReactElement;
  form?: FormInstance<any>;
  initialValues?: {};
};

export const Card = ({
  title,
  subtitle,
  loaded,
  path,
  updateItem,
  deleteItem,
  id,
  editForm,
  form,
  initialValues
}: props) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleEditClick = () => {
    form?.setFieldsValue(initialValues);
    setOpen(true);
  };

  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "delete") {
      try {
        await deleteItem(id);
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
    <EditOutlined key="edit" onClick={handleEditClick} />,
    <Dropdown menu={menuProps}>
      <EllipsisOutlined key="ellipsis" />
    </Dropdown>,
  ];

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await updateItem(id);
      setOpen(false);
      setConfirmLoading(false);
    } catch (e) {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    form?.resetFields();
    setOpen(false);
  };


  return (
    <>
      <CardElement loading={loaded} actions={actions}>
        <Link to={path}>
          <CardElement.Meta title={title} description={<p>{subtitle}</p>} />
        </Link>
      </CardElement>
      <Modal
        title={title}
        open={open}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        destroyOnClose
      >
        {editForm}
      </Modal>
    </>
  );
};
