package com.cragsupplyco.backend.models;

import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Public.class)
    private int id;

    @Column(length = 255)
    @NotBlank
    @JsonView(Views.Public.class)
    private String brand;

    @Column(length = 255)
    @NotBlank
    @JsonView(Views.Public.class)
    private String name;

    @Column(length = 1000)
    @NotBlank
    @JsonView(Views.Public.class)
    private String description;

    @Column(scale = 2)
    @NotNull
    @Min(value = 0)
    @JsonView(Views.Public.class)
    private double price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull
    @JsonIdentityReference(alwaysAsId = true)
    @JsonView(Views.Public.class)
    private Category category;

    @OneToMany(mappedBy = "product")
    @Cascade(CascadeType.ALL)
    @JsonView(Views.Internal.class)
    private List<Inventory> inventory;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
        BigDecimal bdValue = BigDecimal.valueOf(price);
        this.price = bdValue.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Inventory> getInventory() {
        return inventory;
    }

    public void setInventory(List<Inventory> inventory) {
        this.inventory = inventory;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    @Override
    public String toString() {
        return "Product [id=" + id + ", brand=" + brand + ", name=" + name + ", description=" + description + ", price="
                + price + ", category=" + category + ", inventory=" + inventory + "]";
    }

}
