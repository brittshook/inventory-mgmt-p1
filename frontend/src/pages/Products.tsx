import { ButtonWithModal } from "../components/ButtonWithModal";
import { CategoryDataType, getCategories } from "../api/category";
import { Card } from "../components/card/Card";
import { useEffect, useState } from "react";
import gif404 from "/oops.gif";
import { Form, Input } from "antd";

export const Products = () => {
  const [categories, setCategories] = useState<CategoryDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);
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
            onCreate={() => {
              console.log("submit");
            }}
            modalButtonText="Create"
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please input the category name" },
              ]}
            >
              <Input />
            </Form.Item>
          </ButtonWithModal>
        </div>
        <section className="cards">
          {categories?.map((category) => (
            <Card
              key={category.id}
              loaded={loading}
              path={`/inventory?category=${category.id}`}
              title={category.name}
            ></Card>
          ))}
        </section>
      </section>
  );
};
