import { ReactElement, useState } from "react";
import { Button, FormInstance, Modal } from "antd";

type props = {
  children: ReactElement;
  title: string;
  modalButtonText: string;
  buttonType?: "primary" | "link";
  buttonSize?: "small" | "large";
  buttonText: string;
  buttonIcon?: string;
  disabled?: boolean;
  confirmHandler: (data: any) => Promise<void>;
  form: FormInstance<any>;
  recordId?: number;
  setWarehouse?: string | null;
  setCategory?: string | null;
  id?: string;
  loadDataHandler?: () => void;
};

export const ButtonWithModal = ({
  children,
  title,
  modalButtonText,
  buttonType,
  buttonSize,
  buttonText,
  buttonIcon,
  disabled,
  confirmHandler,
  form,
  recordId,
  setCategory,
  setWarehouse,
  id,
  loadDataHandler,
}: props) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    if (loadDataHandler) loadDataHandler();
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (setCategory) values.categoryName = setCategory;
      if (setWarehouse) values.warehouseName = setWarehouse;
      if (recordId) values.id = recordId;
      await confirmHandler(values);
      setOpen(false);
      setConfirmLoading(false);
      form.resetFields();
    } catch (e) {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("cancel clicked");
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        id={id}
        type={buttonType}
        onClick={showModal}
        disabled={disabled}
        size={buttonSize}
      >
        {buttonIcon}
        {buttonText}
      </Button>
      <Modal
        title={title}
        open={open}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalButtonText}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        destroyOnClose
      >
        {children}
      </Modal>
    </>
  );
};
