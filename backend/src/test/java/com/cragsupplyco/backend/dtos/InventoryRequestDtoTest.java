package com.cragsupplyco.backend.dtos;

import java.util.Set;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class InventoryRequestDtoTest {

    private static Validator validator;

    @BeforeClass
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidInventoryRequestDto() {
        InventoryRequestDto dto = new InventoryRequestDto("10", "Large", 1, 1);
        Set<ConstraintViolation<InventoryRequestDto>> violations = validator.validate(dto);
        Assert.assertTrue(violations.isEmpty(), "No validation errors should occur with valid input");
    }

    @Test
    public void testInvalidQuantity() {
        InventoryRequestDto dto = new InventoryRequestDto("", "Large", 1, 1); // invalid quantity
        Set<ConstraintViolation<InventoryRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank quantity");
    }

    @Test
    public void testInvalidSize() {
        InventoryRequestDto dto = new InventoryRequestDto("10", "", 1, 1); // invalid size
        Set<ConstraintViolation<InventoryRequestDto>> violations = validator.validate(dto);
        Assert.assertFalse(violations.isEmpty(), "Validation error should occur for blank size");
    }
}
