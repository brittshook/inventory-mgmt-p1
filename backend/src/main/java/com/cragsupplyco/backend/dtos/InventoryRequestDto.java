package com.cragsupplyco.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InventoryRequestDto {

    @NotBlank
    private String quantity;

    @NotBlank
    private String size;

    // This is one of the difference in the DTO and the model - product id is passed
    // as int
    @NotNull
    private int product;

    // This is one of the difference in the DTO and the model - warehouse id is
    // passed as int
    @NotNull
    private int warehouse;

    public InventoryRequestDto() {
    }

    public InventoryRequestDto(String quantity, String size, int product, int warehouse) {
        this.quantity = quantity;
        this.size = size;
        this.warehouse = warehouse;
        this.product = product;
    }

    public String getQuantity() {
        return this.quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public int getProduct() {
        return product;
    }

    public void setProduct(int product) {
        this.product = product;
    }

    public int getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(int warehouse) {
        this.warehouse = warehouse;
    }
}
