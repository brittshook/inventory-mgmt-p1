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
        closeable = MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close(); // Close any open mocks after test
    }

    /**
     * Test case to verify that findAll() method returns a list of all categories
     * from the repository.
     */
    @Test
    public void testFindAll() {
        List<Category> exepctedCategories = Arrays.asList(new Category(), new Category(), new Category());

        when(categoryRepository.findAll()).thenReturn(exepctedCategories);
        Iterable<Category> result = categoryService.findAll();

        Assert.assertEquals(exepctedCategories, result);
    }

    /**
     * Test case to verify that using the findByName() method with existing name
     * returns the category with specified name from the repository.
     */
    @Test
    public void testFindByExistingName() {
        Category expectedCategory = new Category();
        expectedCategory.setName("Climbing Shoes");

        String categoryName = "Climbing Shoes";

        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findByName(categoryName);
        Assert.assertTrue(result.isPresent());
    }

    /**
     * Test case to verify that using the findByName() method with non-existent name
     * returns an empty result from the repository.
     */
    @Test
    public void testFindByNonExistentName() {
        String categoryName = "Helmets";

        when(categoryRepository.findByName(categoryName)).thenReturn(Optional.empty());

        Optional<Category> result = categoryService.findByName(categoryName);
        Assert.assertTrue(result.isEmpty());
    }

    /**
     * Test case to verify that using the findById() method with existing id
     * returns the category with specified id from the repository.
     */
    @Test
    public void testFindCategoryByExistingId() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(expectedCategory));
        Optional<Category> result = categoryService.findById(categoryId);
        Assert.assertTrue(result.isPresent());
    }

    /**
     * Test case to verify that using the findById() method with non-existent id
     * returns an empty result from the repository.
     */
    @Test
    public void testFindCategoryByNonExistentId() {
        int categoryId = 2;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        Optional<Category> result = categoryService.findById(categoryId);
        Assert.assertTrue(result.isEmpty());
    }

    /**
     * Test case to verify that using the save() method with a valid category
     * returns the created category from the repository.
     */
    @Test
    public void testSaveCategory() {
        Category expectedCategory = new Category();
        expectedCategory.setId(4);

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        Category result = categoryService.save(expectedCategory);
        Assert.assertEquals(expectedCategory, result);
    }

    /**
     * Test case to verify that using the save() method with an invalid category
     * throws an IllegalArgumentException.
     */
    @Test
    public void testSaveCategoryExistingName() {
        Category category = new Category();
        category.setName("Crash Pads");

        when(categoryRepository.existsByName("Crash Pads")).thenReturn(true);

        Assert.assertThrows(IllegalArgumentException.class, () -> {
            categoryService.save(category);
        });
    }

    /**
     * Test case to verify that using the updateCategoryById() method with a valid
     * category returns the updated category from the repository.
     */
    @Test
    public void testUpdateCategoryById() {
        int categoryId = 1;
        Category expectedCategory = new Category();
        expectedCategory.setId(categoryId);
        expectedCategory.setName("Climbing Shoes");

        when(categoryRepository.save(expectedCategory)).thenReturn(expectedCategory);
        when(categoryRepository.existsByName("Climbing Shoes")).thenReturn(false);

        Category result = categoryService.updateCategoryById(categoryId, expectedCategory);
        Assert.assertEquals(expectedCategory, result);
    }

    /**
     * Test case to verify that using the updateCategoryById() method with an
     * invalid category throws an IllegalArgumentException.
     */
    @Test
    public void testUpdateCategoryByIdExistingName() {
        int categoryId = 4;
        Category category = new Category();
        category.setId(categoryId);
        category.setName("Climbing Apparel");

        Category existingCategory = new Category();
        existingCategory.setId(categoryId);
        existingCategory.setName("Climbing Accessories");

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(existingCategory));

        when(categoryRepository.existsByName("Climbing Apparel")).thenReturn(true);

        Assert.assertThrows(IllegalArgumentException.class, () -> {
            categoryService.updateCategoryById(categoryId, category);
        });
    }

    /**
     * Test case to verify that using the deleteById() method with calls the
     * repository deleteById() method.
     */
    @Test
    public void testDeleteCategoryById() {
        int categoryId = 1;
        categoryService.deleteById(categoryId);
        verify(categoryRepository).deleteById(categoryId);
    }

}
