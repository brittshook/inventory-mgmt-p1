import { ButtonWithModal } from "../components/ButtonWithModal";
import {
  CategoryDataType,
  CategoryFormValues,
  deleteCategoryById,
  getCategories,
  postCategory,
} from "../api/category";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";
import gif404 from "/oops.gif";
import { Form, Input } from "antd";

export const Products = () => {
  const [form] = Form.useForm();
  
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (e) {
      e instanceof Error && setError(e);
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
      e instanceof Error && setError(e);
    }
  };

  const handlePost = async (data: CategoryFormValues) => {
    try {
      await postCategory(data);
      await fetchData();
    } catch (e) {
      e instanceof Error && setError(e);
    }
  };

  // TODO: make error message an alert
  if (error)
    return (
      <>
        {console.log(error.message)}
        <img
          src={gif404}
          alt="Animated image captioned 'file that under oops'"
        />
      </>
    );

  return (
    <section id="products">
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
              <Input />
            </Form.Item>
          </Form>
        </ButtonWithModal>
      </div>
      <section className="cards">
        {categories?.map((category) => (
          <Card
            key={category.id}
            id={category.id}
            loaded={loading}
            path={`/inventory?category=${category.id}`}
            title={category.name}
            deleteItem={handleDelete}
          ></Card>
        ))}
      </section>
    </section>
  );
};
