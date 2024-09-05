package com.cragsupplyco.backend.dtos;

import java.util.Set;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class ProductRequestDtoTest {

    private static Validator validator;

    @BeforeClass
    public static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

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

    @Test
    public void testInvalidBlankBrand() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand(""); // invalid brand
        dto.setName("Test Name");
        dto.setDescription("This is a valid test description.");
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank brand");
    }

    @Test
    public void testInvalidBlankName() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName(""); // invalid name
        dto.setDescription("This is a valid test description.");
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank name");
    }

    @Test
    public void testInvalidBlankDescription() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription(""); // invalid description
        dto.setPrice("100.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank description");
    }

    @Test
    public void testInvalidNegativePrice() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setBrand("Test Brand");
        dto.setName("Test Name");
        dto.setDescription("This is a valid test description.");
        dto.setPrice("-10.00");
        dto.setCategory(1);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for negative price");
    }

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
    }
}
