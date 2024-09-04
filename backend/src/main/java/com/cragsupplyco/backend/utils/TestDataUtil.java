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
        // reset id auto generation sequences
        // otherwise the id's will increment
        // where they left off on each reset/reseed
        // making them unreliable for testing
        warehouseRepository.resetIdSequence();
        categoryRepository.resetIdSequence();
        inventoryRepository.resetIdSequence();
        productRepository.resetIdSequence();
    }

    public void generateTestData() {
        if (warehouseRepository.findAll().isEmpty() && productRepository.findAll().isEmpty()
                && categoryRepository.findAll().isEmpty() && inventoryRepository.findAll().isEmpty()) {

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

            categoryRepository.saveAll(Arrays.asList(categoryClimbingShoes, categoryRopes, categoryCarabiners,
                    categoryHelmets, categoryBelayDevices, categoryCrashPads, categoryAccessories, categoryBackpacks,
                    categoryHarnesses, categoryChalk, categoryApparel));

            // Seeding Warehouses
            Warehouse ca1 = new Warehouse();
            ca1.setName("CA1");
            ca1.setMaxCapacity(1000);
            ca1.setStreetAddress("7550 Trade St");
            ca1.setCity("San Diego");
            ca1.setState("CA");
            ca1.setZipCode("92121");

            Warehouse ny1 = new Warehouse();
            ny1.setName("NY1");
            ny1.setMaxCapacity(1200);
            ny1.setStreetAddress("150 5th Ave");
            ny1.setCity("New York");
            ny1.setState("NY");
            ny1.setZipCode("10011");

            Warehouse tx1 = new Warehouse();
            tx1.setName("TX1");
            tx1.setMaxCapacity(1500);
            tx1.setStreetAddress("2100 Kramer Ln");
            tx1.setCity("Austin");
            tx1.setState("TX");
            tx1.setZipCode("78758");

            warehouseRepository.saveAll(Arrays.asList(ca1, ny1, tx1));

            // Seeding Products
            Product productBackpack = new Product();
            productBackpack.setBrand("SilkRun");
            productBackpack.setName("Alpine Explorer Backpack 40L");
            productBackpack.setDescription(
                    "Spacious and ergonomic backpack designed for carrying climbing gear, 40 liters capacity.");
            productBackpack.setPrice(149.99);
            productBackpack.setCategory(categoryBackpacks);

            Product productRope = new Product();
            productRope.setBrand("PeakPro");
            productRope.setName("Titanium Ascend Rope 60m");
            productRope.setDescription(
                    "Durable and lightweight climbing rope, 60 meters long, perfect for lead climbing.");
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

            productRepository.saveAll(Arrays.asList(productBackpack, productRope, productCarabinerSet,
                    productClimbingShoes, productBelayDevice, productHelmet));

            // Seeding Inventory
            Inventory inv1 = new Inventory();
            inv1.setProduct(productRope);
            inv1.setWarehouse(ca1);
            inv1.setSize(null);
            inv1.setQuantity(100);

            Inventory inv2 = new Inventory();
            inv2.setProduct(productClimbingShoes);
            inv2.setWarehouse(ny1);
            inv2.setSize("M");
            inv2.setQuantity(150);

            Inventory inv3 = new Inventory();
            inv3.setProduct(productBackpack);
            inv3.setWarehouse(ny1);
            inv3.setSize("L");
            inv3.setQuantity(200);

            Inventory inv4 = new Inventory();
            inv4.setProduct(productCarabinerSet);
            inv4.setWarehouse(ny1);
            inv4.setSize("S");
            inv4.setQuantity(300);

            Inventory inv5 = new Inventory();
            inv5.setProduct(productHelmet);
            inv5.setWarehouse(ca1);
            inv5.setSize("S");
            inv5.setQuantity(150);

            Inventory inv6 = new Inventory();
            inv6.setProduct(productBelayDevice);
            inv6.setWarehouse(ca1);
            inv6.setSize("L");
            inv6.setQuantity(75);

            Inventory inv7 = new Inventory();
            inv7.setProduct(productHelmet);
            inv7.setWarehouse(tx1);
            inv7.setSize("S");
            inv7.setQuantity(170);

            ca1.setCurrentCapacity(325);
            tx1.setCurrentCapacity(170);
            ny1.setCurrentCapacity(650);

            inventoryRepository.saveAll(Arrays.asList(inv1, inv2, inv3, inv4, inv5, inv6, inv7));
        }

    }

}