import { ReactElement, useState } from "react";
import { Button, Form, Modal } from "antd";

type props = {
  children: ReactElement;
  title: string;
  modalButtonText: string;
  onCreate: (values: any) => void;
  buttonType?: "primary";
  buttonText: string;
  buttonIcon?: string;
  disabled?: boolean;
  initialValues?: {};
};

export const ButtonWithModal = ({
  children,
  title,
  onCreate,
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

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
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
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={initialValues}
          clearOnDestroy
          onFinish={(values) => onCreate(values)}
        >
          {children}
        </Form>
      </Modal>
    </>
  );
};
