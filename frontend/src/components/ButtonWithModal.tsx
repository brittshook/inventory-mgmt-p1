import { ReactElement, useEffect, useState } from "react";
import { Button, Form, Modal } from "antd";

type props = {
  children: ReactElement;
  title: string;
  modalButtonText: string;
  // onCreate: (values: any) => void;
  buttonType?: "primary";
  buttonText: string;
  buttonIcon?: string;
  disabled?: boolean;
  initialValues?: { warehouse?: string | null; categoryName?: string | null };
};

export const ButtonWithModal = ({
  children,
  title,
  // onCreate,
  modalButtonText,
  buttonType,
  buttonText,
  buttonIcon,
  disabled,
  initialValues,
}: props) => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await form.validateFields();
    if (initialValues?.warehouse) values.warehouse = initialValues?.warehouse;
    if (initialValues?.categoryName)
      values.categoryName = initialValues?.categoryName;
    console.log(values);
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
      <Button type={buttonType} onClick={showModal} disabled={disabled}>
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
        <Form layout="vertical" form={form} name="form_in_modal" clearOnDestroy>
          {children}
        </Form>
      </Modal>
    </>
  );
};
