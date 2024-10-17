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
import { ErrorOverlay } from "../components/ErrorOverlay";
import { AxiosError } from "axios";
import { ErrorPage } from "./ErrorPage";

type props = {
  testId?: string;
};

export const Products = ({ testId }: props) => {
  // Initialize forms using Ant Design's Form hook
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(false);

  // Fetch data for categories
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

  // Handle error display and error overlay
  useEffect(() => {
    if (error) {
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
      }, 1600);
    }
  }, [error]);

  // Handle deleting category
  const handleDelete = async (id: number) => {
    try {
      await deleteCategoryById(id);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle adding new category
  const handlePost = async (data: CategoryFormValues) => {
    try {
      await postCategory(data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  // Handle updating existing category
  const handlePut = async (id: number) => {
    try {
      const data = updateForm.getFieldsValue();
      await putCategory(id, data);
      await fetchData();
    } catch (e) {
      e instanceof AxiosError && setError(e);
      throw new Error();
    }
  };

  if (loading) return <div>Loading...</div>;

  // Render an error page if a 404 error occurs
  if (error?.message.includes("404"))
    return <ErrorPage testId={testId && "error-page"} />;

  return (
    <section data-testid={testId} id="products">
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
            isCategory
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
      {/* Display error overlay if an error occurs and it's not a 404 error */}
      {showErrorOverlay && !error?.message.includes("404") && (
        <div data-testid="error-overlay">
          <ErrorOverlay
            messageText={
              error?.message.includes("500")
                ? "Server Error. Please try again later."
                : JSON.stringify(error?.response?.data)
                ? JSON.stringify(error?.response?.data).replace(/"/g, "")
                : "Error occurred. Please try again."
            }
          />
        </div>
      )}
    </section>
  );
};
