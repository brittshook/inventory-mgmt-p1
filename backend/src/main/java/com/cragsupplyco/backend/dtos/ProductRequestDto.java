package com.cragsupplyco.backend.dtos;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductRequestDto {

    @Column(length = 255)
    @NotBlank
    private String brand;

    @Column(length = 255)
    @NotBlank
    private String name;

    @Column(length = 1000)
    @NotBlank
    private String description;

    @Column(scale = 2)
    @NotNull
    @Min(value = 0)
    private double price;

    // This is the difference in the DTO and the model - category id is passed as
    // int
    @NotNull
    private int category;

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "ProductRequestDto [brand=" + brand + ", name=" + name + ", description=" + description + ", price="
                + price + ", category=" + category + "]";
    }

}
