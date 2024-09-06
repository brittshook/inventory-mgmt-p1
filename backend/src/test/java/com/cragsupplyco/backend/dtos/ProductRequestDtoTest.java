package com.cragsupplyco.backend.dtos;

import java.util.Set;

import org.junit.AfterClass;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class ProductRequestDtoTest {

    private Validator validator;

    @BeforeClass
    public void setUp() {
        // Set up the validator before the tests are executed
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterClass
    public void teardown() {
        // Clean up the validator after all tests are executed
        validator = null;
    }

    /**
     * Test case for a valid ProductRequestDto. Verifies that no validation errors
     * occur with valid inputs.
     */
    @Test
    public void testValidProductRequestDto() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription("This is a valid test description.");
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertTrue(violations.isEmpty(), "No validation errors should occur with valid input");
    }

    /**
     * Test case for an invalid ProductRequestDto with missing/incorrect brand
     * data. Verifies that validation errors occur due to invalid brand input.
     */
    @Test
    public void testInvalidBrand() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand(""); // invalid brand
        dto.setName("Test Name");
        dto.setDescription("This is a valid test description.");
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank brand");
    }

    /**
     * Test case for an invalid ProductRequestDto with missing/incorrect name
     * data. Verifies that validation errors occur due to invalid name input.
     */
    @Test
    public void testInvalidName() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName(""); // invalid name
        dto.setDescription("This is a valid test description.");
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank name");
    }

    /**
     * Test case for an invalid ProductRequestDto with missing/incorrect description
     * data. Verifies that validation errors occur due to invalid description input.
     */
    @Test
    public void testInvalidDescription() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription(""); // invalid description
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank description");
    }

    /**
     * Test case for an invalid ProductRequestDto with missing/incorrect price
     * data. Verifies that validation errors occur due to invalid price input.
     */
    @Test
    public void testInvalidPrice() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription("This is a valid test description.");
        dto.setPrice("-10.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for negative price");
    }

    /**
     * Test case for validating the default constructor and setter methods
     * of the ProductRequestDto class. Verifies that no validation errors
     * occur when valid input is provided and that the fields are correctly
     * set and retrieved.
     */
    @Test
    public void testDefaultConstructorAndSetters() {
        ProductRequestDto dto = new ProductRequestDto();

        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription("This is a test description.");
        dto.setPrice("99.99");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertTrue(violations.isEmpty(), "No validation errors should occur with valid input");

        Assert.assertTrue(dto.getBrand().equals("Test Brand"));
        Assert.assertTrue(dto.getName().equals("Test Name"));
        Assert.assertTrue(dto.getDescription().equals("This is a test description."));
        Assert.assertTrue(dto.getCategory() == 1);
        Assert.assertTrue(dto.getPrice() == "99.99");
    }

    /**
     * Test case for validating the toString() method of the ProductRequestDto
     * class. Verifies that the string representation of the object matches the
     * expected format.
     */
    @Test
    public void testToString() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription("This is a test description.");
        dto.setPrice("99.99");
        dto.setCategory(1);

        String expectedToString = "ProductRequestDto [brand=Test Brand, name=Test Name, description=This is a test description., price=99.99, category=1]";
        Assert.assertEquals(dto.toString(), expectedToString);
    }

}
