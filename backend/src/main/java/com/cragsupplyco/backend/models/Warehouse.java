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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "name")
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment to generate PK
    @JsonView(Views.Public.class)
    private int id;

    @Column(length = 50, unique = true) // Name must be unique
    @NotBlank
    @JsonView(Views.Public.class)
    private String name;

    @Min(value = 1)
    @NotNull
    @JsonView(Views.Public.class)
    private int maxCapacity;

    @Min(value = 0)
    @NotNull
    @JsonView(Views.Public.class)
    private int currentCapacity;

    @Column(length = 255)
    @NotBlank
    @JsonView(Views.Public.class)
    private String streetAddress;

    @Column(length = 50)
    @NotBlank
    @JsonView(Views.Public.class)
    private String city;

    @Column(length = 2)
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}$") // Must be 2 uppercase characters (e.g., VA, CA, MD)
    @JsonView(Views.Public.class)
    private String state;

    @Column(length = 10)
    @NotBlank
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$")
    @JsonView(Views.Public.class)
    private String zipCode;

    @OneToMany(mappedBy = "warehouse") // One product can have many inventory items (stored in different warehouses, in
                                       // various sizes)
    @Cascade(CascadeType.ALL)
    @JsonView(Views.Internal.class) // Used to hide field on public view; only included when internal view is used
                                    // on controller method
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

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public List<Inventory> getInventory() {
        return inventory;
    }

    public void setInventory(List<Inventory> inventory) {
        this.inventory = inventory;
    }

    public int getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(int currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    @Override
    public String toString() {
        return "Warehouse [id=" + id + ", name=" + name + ", maxCapacity=" + maxCapacity + ", currentCapacity="
                + currentCapacity + ", streetAddress="
                + streetAddress + ", city=" + city + ", state=" + state + ", zipCode=" + zipCode + ", inventory="
                + inventory + "]";
    }

}
