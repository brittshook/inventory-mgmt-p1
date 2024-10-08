package com.cragsupplyco.backend.models;

import java.util.List;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "name")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment to generate PK
    @JsonView(Views.Public.class)
    private int id;

    @Column(length = 50, unique = true)
    @NotBlank
    @JsonView(Views.Public.class)
    private String name;

    @OneToMany(mappedBy = "category") // One category has many products within it
    @Cascade(CascadeType.ALL)
    @JsonView(Views.Internal.class) // Used to hide field on public view; only included when internal view is used
                                    // on controller method
    List<Product> products;

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

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "Category [id=" + id + ", name=" + name + ", products=" + products + "]";
    }

}
