package com.cragsupplyco.backend.models;

import com.fasterxml.jackson.annotation.JsonIdentityReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @NotNull
    @JsonIdentityReference(alwaysAsId = true)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    @NotNull
    @JsonIdentityReference(alwaysAsId = true)
    private Warehouse warehouse;

    @Column(length = 20)
    private String size;

    @NotNull
    private int quantity;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "Inventory [id=" + id + ", product=" + product + ", warehouse=" + warehouse + ", size=" + size
                + ", quantity=" + quantity + "]";
    }

}
