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

public class InventoryRequestDtoTest {

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
     * Test case for a valid InventoryRequestDto. Verifies that no validation errors
     * occur with valid inputs.
     */
    @Test
    public void testValidInventoryRequestDto() {
        InventoryRequestDto dto = new InventoryRequestDto("10", "Large", 1, 1);
        Set<ConstraintViolation<InventoryRequestDto>> violations = validator.validate(dto);
        Assert.assertTrue(violations.isEmpty(), "No validation errors should occur with valid input");
    }

    /**
     * Test case for an invalid InventoryRequestDto with missing/incorrect quantity
     * data. Verifies that validation errors occur due to invalid quantity input.
     */
    @Test
    public void testInvalidQuantity() {
        InventoryRequestDto dto = new InventoryRequestDto("", "Large", 1, 1); // invalid quantity
        Set<ConstraintViolation<InventoryRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank quantity");
    }
}