package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.services.CategoryService;

public class CategoryControllerTests {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;
    private AutoCloseable closeable;

    private Category category1;
    private Category category2;

    private Category validCategory;
    private Category invalidCategory;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        category1 = new Category();
        category1.setId(1);
        category1.setName("Climbing Apparel");

        category2 = new Category();
        category2.setId(2);
        category2.setName("Ropes");

        validCategory = new Category();
        validCategory.setId(3);
        validCategory.setName("Climbing Accessories");

        invalidCategory = new Category();
        invalidCategory.setName("");
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close();
        }
    }
    

    @Test
    public void testFindAllCategories() {
        List<Category> expectedCategories = Arrays.asList(category1, category2);

        when(categoryService.findAll()).thenReturn(expectedCategories);

        Iterable<Category> result = categoryController.findAllCategories();

        assertEquals(result, expectedCategories);
        verify(categoryService, times(1)).findAll();
    }

    @Test
    public void testFindCategoryById() {
        int id = category1.getId();
        when(categoryService.findById(id)).thenReturn(Optional.of(category1));

        ResponseEntity<Category> response = categoryController.findCategoryById(id);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), category1);
        verify(categoryService, times(1)).findById(id);
    }

    @Test
    public void testFindCategoryByIdNotFound() {
        int id = 999;
        when(categoryService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.findCategoryById(id);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(categoryService, times(1)).findById(id);
    }

    @Test
    public void testFindCategoryByName() {
        String name = category1.getName();
        when(categoryService.findByName(name)).thenReturn(Optional.of(category1));

        ResponseEntity<Category> response = categoryController.findCategoryByName(name);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), category1);
        verify(categoryService, times(1)).findByName(name);
    }

    @Test
    public void testFindCategoryByNameNotFound() {
        String name = "Unknown Category";
        when(categoryService.findByName(name)).thenReturn(Optional.empty());

        ResponseEntity<Category> response = categoryController.findCategoryByName(name);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(categoryService, times(1)).findByName(name);
    }

    @Test
    public void testCreateValidCategory() {
        when(categoryService.save(any(Category.class))).thenReturn(validCategory);

        Category result = categoryController.createCategory(validCategory);

        assertEquals(result, validCategory);
        verify(categoryService, times(1)).save(any(Category.class));
    }

    @Test
    public void testCreateInvalidCategory() {
        Category category = categoryController.createCategory(invalidCategory);

        assertEquals(category, null);
    }

    @Test
    public void testUpdateCategoryById() {
        categoryController.updateCategoryById(3, validCategory);

        verify(categoryService, times(1)).updateCategoryById(eq(3), any(Category.class));
    }

    @Test
    public void testDeleteCategoryById() {
        categoryController.deleteCategoryById(3);

        verify(categoryService, times(1)).deleteById(3);
    }
}
