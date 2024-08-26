package com.cragsupplyco.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.repositories.CategoryRepository;

public class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;
    private AutoCloseable closeable;

    @Mock
    private CategoryRepository categoryRepository;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close();
    }

    @Test
    public void testFindAll() {
        Category category1 = new Category();
        Category category2 = new Category();
        Category category3 = new Category();
        List<Category> exepctedCategories = Arrays.asList(category1, category2, category3);

        when(categoryRepository.findAll()).thenReturn(exepctedCategories);
        Iterable<Category> result = categoryService.findAll();

        int count = 0;
        for (Category category : result) {
            count++;
        }

        assertTrue(count == exepctedCategories.size());
    }

    @Test
    public void testFindByExistingName() {
        String categoryName = "Climbing Shoes";
        Category expectedCategory = new Category();
        expectedCategory.setName(categoryName);

        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findByName(categoryName);
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindByNonExistentName() {
        String categoryName = "Helmets";

        Optional<Category> result = categoryService.findByName(categoryName);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testFindCategoryByExistingId() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findById(categoryId);
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindCategoryByNonExistentId() {
        int categoryId = 2;

        Optional<Category> result = categoryService.findById(categoryId);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testSaveCategory() {
        int categoryId = 4;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        Category result = categoryService.save(expectedCategory);
        assertEquals(expectedCategory, result);
    }

    @Test
    public void testUpdateCategoryById() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        Category result = categoryService.updateCategoryById(categoryId, expectedCategory);
        assertEquals(expectedCategory, result);
    }

    @Test
    public void testDeleteCategoryById() {
        int categoryId = 1;
        categoryService.deleteById(categoryId);
        verify(categoryRepository).deleteById(categoryId);
    }

}
