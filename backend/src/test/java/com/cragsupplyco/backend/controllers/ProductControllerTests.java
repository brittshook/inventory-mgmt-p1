package com.cragsupplyco.backend.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.services.ProductService;

public class ProductControllerTests {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private Product product1;
    private Product product2;

    private String validProductJson;
    private Product validProduct;
    private Product invalidProduct;

    @BeforeMethod
public void setUp() {
    MockitoAnnotations.openMocks(this);

    mockMvc = MockMvcBuilders.standaloneSetup(productController)
            .setValidator(new LocalValidatorFactoryBean())
            .build();

    Category mockCategory = new Category();
    mockCategory.setId(1);
    mockCategory.setName("Climbing Gear");
    mockCategory.setProducts(Arrays.asList(product1, product2, validProduct, invalidProduct));

    product1 = new Product();
    product1.setId(1);
    product1.setName("Climbing Shoes");
    product1.setBrand("PenguinPro");
    product1.setDescription("Durable climbing shoes");
    product1.setPrice(150.0);
    product1.setCategory(mockCategory);

    product2 = new Product();
    product2.setId(2);
    product2.setName("Rope");
    product2.setBrand("EverStrong");
    product2.setDescription("Tough climbing rope");
    product2.setPrice(80.0);
    product2.setCategory(mockCategory);

    validProduct = new Product();
    validProduct.setId(3);
    validProduct.setName("Hiking Boots");
    validProduct.setBrand("HikersInc");
    validProduct.setDescription("Durable climbing boots");
    validProduct.setPrice(150.0);
    validProduct.setCategory(mockCategory);
    // model annotation @JsonIdentityInfo will cause nested object "category" not to serialize properly in a call like ObjectMapper.writeValueAsString
    // so the JSON for the post methods must be manually defined
    validProductJson = "{\"id\":3,\"brand\":\"HikersInc\",\"name\":\"Hiking Boots\",\"description\":\"Durable climbing boots\",\"price\":150.0,\"category\":{\"id\":1,\"name\":\"Climbing Gear\"},\"inventory\":null}";

    invalidProduct = new Product();
    invalidProduct.setPrice(0.0);
    invalidProduct.setCategory(mockCategory);

}

    @Test
    public void testFindAllProducts() throws Exception {
        given(productService.findAll()).willReturn(Arrays.asList(product1, product2));
        mockMvc.perform(get("/api/product")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Climbing Shoes"))
                .andExpect(jsonPath("$[1].name").value("Rope"));
    }

    @Test
    public void testFindAllProductsWithCategoryId() throws Exception {
        int categoryId = 1;
        given(productService.findAllByCategoryId(categoryId)).willReturn(Arrays.asList(product1));
        mockMvc.perform(get("/api/product/detailed")
                .param("categoryId", String.valueOf(categoryId))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Climbing Shoes"));
    }

    @Test
    public void testCreateValidProduct() throws Exception {
        given(productService.save(any(Product.class))).willReturn(validProduct);
        mockMvc.perform(post("/api/product")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validProductJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Hiking Boots"))
                .andExpect(jsonPath("$.brand").value("HikersInc"));
    }
}
