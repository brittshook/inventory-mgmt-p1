package com.cragsupplyco.backend.utils;

import java.util.Arrays;

import org.springframework.context.annotation.Configuration;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.CategoryRepository;
import com.cragsupplyco.backend.repositories.InventoryRepository;
import com.cragsupplyco.backend.repositories.ProductRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

@Configuration
public class TestDataUtil {

    final private WarehouseRepository warehouseRepository;
    final private ProductRepository productRepository;
    final private CategoryRepository categoryRepository;
    final private InventoryRepository inventoryRepository;
    
    public TestDataUtil(WarehouseRepository warehouseRepository, ProductRepository productRepository, 
                                  CategoryRepository categoryRepository, InventoryRepository inventoryRepository) {
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
    }
  
    public void clearDatabase() {
        warehouseRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        inventoryRepository.deleteAll();
        // reset id auto generation sequences, otherwise the id's will increment where they left off 
        // on each reset/reseed, making them unreliable for testing
        categoryRepository.resetIdSequence();
        warehouseRepository.resetIdSequence();
    }

    public void generateTestData() {
        if (warehouseRepository.findAll().isEmpty() && productRepository.findAll().isEmpty() && categoryRepository.findAll().isEmpty() && inventoryRepository.findAll().isEmpty()) {

            // Seeding Categories
            Category categoryClimbingShoes = new Category();
            categoryClimbingShoes.setName("Climbing Shoes");
            Category categoryRopes = new Category();
            categoryRopes.setName("Ropes");
            Category categoryCarabiners = new Category();
            categoryCarabiners.setName("Carabiners");
            Category categoryHelmets = new Category();
            categoryHelmets.setName("Helmets");
            Category categoryBelayDevices = new Category();
            categoryBelayDevices.setName("Belay Devices");
            Category categoryCrashPads = new Category();
            categoryCrashPads.setName("Crash Pads");
            Category categoryAccessories = new Category();
            categoryAccessories.setName("Climbing Accessories");
            Category categoryBackpacks = new Category();
            categoryBackpacks.setName("Backpacks & Daypacks");
            Category categoryHarnesses = new Category();
            categoryHarnesses.setName("Harnesses");
            Category categoryChalk = new Category();
            categoryChalk.setName("Chalk & Chalk Bags");
            Category categoryApparel = new Category();
            categoryApparel.setName("Climbing Apparel");

            categoryRepository.saveAll(Arrays.asList(categoryClimbingShoes, categoryRopes, categoryCarabiners, categoryHelmets, categoryBelayDevices, categoryCrashPads, categoryAccessories, categoryBackpacks, categoryHarnesses, categoryChalk, categoryApparel));

            // Seeding Warehouses
            Warehouse ca1 = new Warehouse();
            ca1.setName("CA1");
            ca1.setMaxCapacity(1000);
            ca1.setStreetAddress("7550 Trade St");
            ca1.setCity("San Diego");
            ca1.setState("CA");
            ca1.setZipCode("92121");

            warehouseRepository.saveAll(Arrays.asList(ca1));

            // Seeding Products
            Product productBackpack = new Product();
            productBackpack.setBrand("SilkRun");
            productBackpack.setName("Alpine Explorer Backpack 40L");
            productBackpack.setDescription("Spacious and ergonomic backpack designed for carrying climbing gear, 40 liters capacity.");
            productBackpack.setPrice(149.99);
            productBackpack.setCategory(categoryBackpacks);

            Product productRope = new Product();
            productRope.setBrand("PeakPro");
            productRope.setName("Titanium Ascend Rope 60m");
            productRope.setDescription("Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.");
            productRope.setPrice(199.99);
            productRope.setCategory(categoryRopes);

            Product productCarabinerSet = new Product();
            productCarabinerSet.setBrand("RockGuard");
            productCarabinerSet.setName("ProLock Carabiner Set");
            productCarabinerSet.setDescription("Set of 5 lightweight carabiners, essential for any climbing setup.");
            productCarabinerSet.setPrice(29.99);
            productCarabinerSet.setCategory(categoryCarabiners);

            Product productClimbingShoes = new Product();
            productClimbingShoes.setBrand("SummitKing");
            productClimbingShoes.setName("Peak Performance Climbing Shoes");
            productClimbingShoes.setDescription("High-performance climbing shoes with excellent grip and comfort.");
            productClimbingShoes.setPrice(129.99);
            productClimbingShoes.setCategory(categoryClimbingShoes);

            Product productBelayDevice = new Product();
            productBelayDevice.setBrand("SafeClimb");
            productBelayDevice.setName("Guardian Belay Device");
            productBelayDevice.setDescription("Easy-to-use belay device for secure climbing and rappelling.");
            productBelayDevice.setPrice(24.99);
            productBelayDevice.setCategory(categoryBelayDevices);

            Product productHelmet = new Product();
            productHelmet.setBrand("PeakGuard");
            productHelmet.setName("Eagle Eye Climbing Helmet");
            productHelmet.setDescription("Protective climbing helmet with adjustable fit and ventilation.");
            productHelmet.setPrice(89.99);
            productHelmet.setCategory(categoryHelmets);

            productRepository.saveAll(Arrays.asList(productBackpack, productRope, productCarabinerSet, productClimbingShoes, productBelayDevice, productHelmet));

            // Seeding Inventory
            Inventory inv1 = new Inventory();
            inv1.setQuantity(100);
            inv1.setProduct(productRope);
            inv1.setWarehouse(ca1);
            inv1.setSize(null);

            Inventory inv8 = new Inventory();
            inv8.setQuantity(200);
            inv8.setProduct(productBelayDevice);
            inv8.setWarehouse(ca1);
            inv8.setSize("L");

            inventoryRepository.saveAll(Arrays.asList(inv1, inv8));
        }
    }

}