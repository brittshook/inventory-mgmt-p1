package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.services.CategoryService;

public class CategoryControllerTests {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;
    private AutoCloseable closeable;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close();
        }
    }

    @Test
    public void testFindAllCategories() {
        List<Category> expectedCategories = Arrays.asList(new Category(), new Category());

        when(categoryService.findAll()).thenReturn(expectedCategories);

        Iterable<Category> result = categoryController.findAllCategories();

        Assert.assertEquals(result, expectedCategories);
        verify(categoryService, times(1)).findAll();
    }

    @Test
    public void testFindCategoryById() {
        Category category1 = new Category();
        category1.setId(1);

        int id = category1.getId();
        when(categoryService.findById(id)).thenReturn(Optional.of(category1));

        ResponseEntity<Category> response = categoryController.findCategoryById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), category1);
        verify(categoryService, times(1)).findById(id);
    }

    @Test
    public void testFindCategoryByyNonExistentId() {
        int id = 999;
        when(categoryService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.findCategoryById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(categoryService, times(1)).findById(id);
    }

    @Test
    public void testFindCategoryByName() {
        Category category1 = new Category();
        category1.setId(1);
        category1.setName("Climbing Shoes");

        String name = "Climbing Shoes";
        when(categoryService.findByName(name)).thenReturn(Optional.of(category1));

        ResponseEntity<Category> response = categoryController.findCategoryByName(name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), category1);
        verify(categoryService, times(1)).findByName(name);
    }

    @Test
    public void testFindCategoryByyNonExistentName() {
        String name = "Unknown Category";
        when(categoryService.findByName(name)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.findCategoryByName(name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(categoryService, times(1)).findByName(name);
    }

    @Test
    public void testCreateValidCategory() {
        Category validCategory = new Category();
        validCategory.setId(3);
        validCategory.setName("Climbing Accessories");

        when(categoryService.save(any(Category.class))).thenReturn(validCategory);

        Category result = categoryController.createCategory(validCategory);

        Assert.assertEquals(result, validCategory);
        verify(categoryService, times(1)).save(validCategory);
    }

    @Test
    public void testCreateInvalidCategory() {
        Category invalidCategory = new Category();
        invalidCategory.setName("");

        Category category = categoryController.createCategory(invalidCategory);

        Assert.assertEquals(category, null);
    }

    @Test
    public void testUpdateCategoryById() {
        Category validCategory = new Category();
        validCategory.setId(3);
        validCategory.setName("Climbing Accessories");

        categoryController.updateCategoryById(3, validCategory);

        verify(categoryService, times(1)).updateCategoryById(eq(3), any(Category.class));
    }

    @Test
    public void testDeleteCategoryById() {
        categoryController.deleteCategoryById(3);

        verify(categoryService, times(1)).deleteById(3);
    }
}
