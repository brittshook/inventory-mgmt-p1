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
  testId?: string;
  isCategory?: boolean;
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
  initialValues,
  testId,
  isCategory,
}: props) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Handler to open the edit modal and set initial form values
  const handleEditClick = () => {
    form?.setFieldsValue(initialValues);
    setOpen(true);
  };

  // Handler for menu item click events – currently just delete
  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "delete") {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  // Menu items for the dropdown
  const items: MenuProps["items"] = [
    {
      label: "Delete",
      key: "delete",
      danger: true,
    },
  ];

  const menuProps = {
    items, // Set menu items
    onClick: handleMenuClick, // Set menu click handler
  };

  const actions: React.ReactNode[] = [
    // Edit button
    <EditOutlined
      data-testid={testId && "edit-card-button"}
      key="edit"
      onClick={handleEditClick}
      aria-label={`Edit ${title}${isCategory ? " category" : ""}`}
    />,
    // Dropdown button with delete option
    <Dropdown key="dropdown" menu={menuProps}>
      <EllipsisOutlined
        key="ellipsis"
        data-testid={testId && "card-ellipsis-button"}
        aria-label={`More options for ${title}${isCategory ? " category" : ""}`}
      />
    </Dropdown>,
  ];

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await updateItem(id);
      setOpen(false);
      setConfirmLoading(false); // Reset loading state
    } catch (e) {
      setConfirmLoading(false); // Reset loading state if error occurs
    }
  };

  // Handler for Cancel button in the modal to reset fields and close modal
  const handleCancel = () => {
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
