import { ButtonWithModal } from "../components/ButtonWithModal";
import {
  CategoryDataType,
  CategoryFormValues,
  deleteCategoryById,
  getCategories,
  postCategory,
  putCategory,
} from "../api/category";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { ErrorPage } from "./ErrorPage";
import { ErrorOverlay } from "../components/ErrorOverlay";
import { AxiosError } from "axios";

type props = {
  testId?: string;
};

export const Products = ({ testId }: props) => {
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (e) {
      e instanceof AxiosError && setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCategoryById(id);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
    }
  };

  const handlePost = async (data: CategoryFormValues) => {
    try {
      await postCategory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
    }
  };

  const handlePut = async (id: number) => {
    try {
      const data = updateForm.getFieldsValue();
      await putCategory(id, data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error?.message.includes("500"))
    return <ErrorPage messageText={error.message} />;

  return (
    <section data-testid={testId} id="products">
      {error?.message.includes("400") && (
        <ErrorOverlay
          messageText={JSON.stringify(error.response?.data).replace(/"/g, "")}
        />
      )}
      <div className="section-heading">
        <h1>Products</h1>
        <ButtonWithModal
          buttonText="Add Category"
          buttonType="primary"
          title="New Product Category"
          modalButtonText="Create"
          confirmHandler={handlePost}
          form={form}
        >
          <Form layout="vertical" form={form} name="form_in_modal">
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please input the category name" },
              ]}
            >
              <Input data-testid={testId && "create-category-name-field"} />
            </Form.Item>
          </Form>
        </ButtonWithModal>
      </div>
      <section
        className="cards"
        data-testid={testId && "category-cards-section"}
      >
        {categories?.map((category) => (
          <Card
            testId={testId && `category-card-${category.id}`}
            key={category.id}
            id={category.id}
            loaded={loading}
            path={`/inventory?category=${category.id}`}
            title={category.name}
            deleteItem={handleDelete}
            updateItem={handlePut}
            form={updateForm}
            initialValues={{ name: category.name }}
            editForm={
              <Form layout="vertical" form={updateForm} name="form_in_modal">
                <Form.Item
                  label="Category Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the category name!",
                    },
                  ]}
                >
                  <Input data-testid={testId && "edit-category-name-field"} />
                </Form.Item>
              </Form>
            }
          ></Card>
        ))}
      </section>
    </section>
  );
};
