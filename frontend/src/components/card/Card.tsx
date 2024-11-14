import React, { ReactElement, useEffect, useState } from "react";
import { Card as CardElement, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./Card.css";
import { Link } from "react-router-dom";
import type { FormInstance } from "antd";

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
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Edit tabindex to allow proper keyboard navigation
  useEffect(() => {
    const editIcons = document.querySelectorAll(".anticon-edit");
    const deleteIcons = document.querySelectorAll(".anticon-delete");

    editIcons.forEach((editIcon) => {
      editIcon.setAttribute("tabindex", "0");
    });
    deleteIcons.forEach((deleteIcon) => {
      deleteIcon.setAttribute("tabindex", "0");
    });
  }, []);

  // Handler to open the edit modal and set initial form values
  const handleEditClick = () => {
    form?.setFieldsValue(initialValues);
    setOpenModal(true);
  };

  // Handler for menu item click events – currently just delete
  const handleDeleteClick = async () => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const actions: React.ReactNode[] = [
    // Edit button
    <EditOutlined
      role="button"
      data-testid={testId && "edit-card-button"}
      key="edit"
      onClick={handleEditClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleEditClick();
        }
      }}
      aria-label={`Edit ${title}${isCategory ? " category" : ""}`}
    />,
    // Dropdown button with delete option
    <DeleteOutlined
      role="button"
      data-testid={testId && "delete-card-button"}
      key="delete"
      className="delete-icon"
      aria-label={`Delete ${title}${isCategory ? " category" : ""}`}
      onClick={handleDeleteClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleDeleteClick();
        }
      }}
    />,
  ];

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await updateItem(id);
      setOpenModal(false);
      setConfirmLoading(false); // Reset loading state
    } catch (e) {
      setConfirmLoading(false); // Reset loading state if error occurs
    }
  };

  // Handler for Cancel button in the modal to reset fields and close modal
  const handleCancel = () => {
    form?.resetFields();
    setOpenModal(false);
  };

  return (
    <>
      <CardElement loading={loaded} actions={actions}>
        <Link to={path}>
          <CardElement.Meta title={title} description={<p>{subtitle}</p>} />
        </Link>
      </CardElement>
      <Modal
        title={"Update " + title}
        open={openModal}
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
