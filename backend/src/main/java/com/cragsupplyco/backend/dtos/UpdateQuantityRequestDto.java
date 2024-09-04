package com.cragsupplyco.backend.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class UpdateQuantityRequestDto {
    @NotBlank
    private String operation;

    @Min(value = 1)
    private int value = 1; // Sets default value to 1 if not passed

    public UpdateQuantityRequestDto() {
    }

    // This DTO is useful to quickly increment or decrement quantity by X value
    public UpdateQuantityRequestDto(String operation, int value) {
        this.operation = operation;
        this.value = value;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation; // e.g., "increment", "decrement"
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

}
