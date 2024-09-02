package com.cragsupplyco.backend.services;

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
import org.testng.Assert;

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
        List<Category> exepctedCategories = Arrays.asList(new Category(), new Category(), new Category());

        when(categoryRepository.findAll()).thenReturn(exepctedCategories);
        Iterable<Category> result = categoryService.findAll();

        Assert.assertEquals(exepctedCategories, result);
    }

    @Test
    public void testFindByExistingName() {
        Category expectedCategory = new Category();
        expectedCategory.setName("Climbing Shoes");

        String categoryName = "Climbing Shoes";

        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findByName(categoryName);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindByNonExistentName() {
        String categoryName = "Helmets";

        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.empty());

        Optional<Category> result = categoryService.findByName(categoryName);
        Assert.assertTrue(result.isEmpty());
    }

    @Test
    public void testFindCategoryByExistingId() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findById(categoryId);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindCategoryByNonExistentId() {
        int categoryId = 2;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        Optional<Category> result = categoryService.findById(categoryId);
        Assert.assertTrue(result.isEmpty());
    }

    @Test
    public void testSaveCategory() {
        Category expectedCategory = new Category();
        expectedCategory.setId(4);

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        Category result = categoryService.save(expectedCategory);
        Assert.assertEquals(expectedCategory, result);
    }

    @Test
    public void testUpdateCategoryById() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);
        expectedCategory.setName("Climbing Shoes");

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        Category result = categoryService.updateCategoryById(categoryId, expectedCategory);
        Assert.assertEquals(expectedCategory, result);
    }

    @Test
    public void testDeleteCategoryById() {
        int categoryId = 1;
        categoryService.deleteById(categoryId);
        verify(categoryRepository).deleteById(categoryId);
    }

}
