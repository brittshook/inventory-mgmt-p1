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

public class UpdateQuantityRequestDtoTest {

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
     * Test case for a valid UpdateQuantityRequestDto. Verifies that no validation
     * errors occur with valid inputs.
     */
    @Test
    public void testValidUpdateQuantityRequestDto() {
        UpdateQuantityRequestDto dto = new UpdateQuantityRequestDto("increase", 5);
        Set<ConstraintViolation<UpdateQuantityRequestDto>> violations = validator.validate(dto);
        Assert.assertTrue(violations.isEmpty(), "No validation errors should occur with valid input");
    }

    /**
     * Test case for an invalid InventoryRequestDto with missing/incorrect operation
     * data. Verifies that validation errors occur due to invalid operation input.
     */
    @Test
    public void testInvalidOperation() {
        UpdateQuantityRequestDto dto = new UpdateQuantityRequestDto("", 5); // Invalid operation
        Set<ConstraintViolation<UpdateQuantityRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for empty operation");
    }

    /**
     * Test case for an invalid InventoryRequestDto with missing/incorrect value
     * data. Verifies that validation errors occur due to invalid value input.
     */
    @Test
    public void testInvalidValue() {
        UpdateQuantityRequestDto dto = new UpdateQuantityRequestDto("decrement", 0); // Invalid value
        Set<ConstraintViolation<UpdateQuantityRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for value less than 1");
    }
}
