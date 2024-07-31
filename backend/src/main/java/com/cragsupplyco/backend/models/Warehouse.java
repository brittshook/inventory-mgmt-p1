package com.cragsupplyco.backend.models;

import java.util.List;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Public.class)
    private int id;

    @Column(length = 50)
    @NotBlank
    @JsonView(Views.Public.class)
    private String name;

    @Min(value = 1)
    @NotNull
    @JsonView(Views.Public.class)
    private int maxCapacity;

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
    @Pattern(regexp = "^[A-Z]{2}$")
    @JsonView(Views.Public.class)
    private String state;

    @Column(length = 10)
    @NotBlank
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$")
    @JsonView(Views.Public.class)
    private String zipCode;

    @OneToMany(mappedBy = "warehouse")
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

    @Override
    public String toString() {
        return "Warehouse [id=" + id + ", name=" + name + ", maxCapacity=" + maxCapacity + ", streetAddress="
                + streetAddress + ", city=" + city + ", state=" + state + ", zipCode=" + zipCode + ", inventory="
                + inventory + "]";
    }

}
