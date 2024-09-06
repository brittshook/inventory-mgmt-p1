# Crag Supply Co Inventory Management System

[![CucumberReports: Crag Supply Co - Pipeline](https://messages.cucumber.io/api/report-collections/4836ff78-3584-4e46-8548-5e7674dc4321/badge)](https://reports.cucumber.io/report-collections/4836ff78-3584-4e46-8548-5e7674dc4321)
[![Backend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=brittshook_inventory-mgmt-p1&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=brittshook_inventory-mgmt-p1)
[![Frontend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mgmt-p1&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mgmt-p1)

## Project Overview

### Technology Stack

- **Backend:** Java with Spring Boot
- **Frontend:** React with TypeScript
- **UI Framework:** Ant Design (open-source)

### Project Description

This project involves building an inventory management system for Crag Supply Co, a climbing gear supply store. The system is designed to manage and track inventory across various product categories and warehouses.

### Entity-Relationship Diagram (ERD)

![](Crag_Supply_ERD.png)

## Features

### Dashboard

The dashboard provides high-level overview of the inventory, including total inventory counts and total capacity.

### Viewing Inventory

It provides three ways to view inventory:

1. **By Product Categories:** View inventory categorized by different types of climbing gear.
2. **By Warehouse:** View inventory based on different warehouse locations.
3. **All:** View all inventory items at once.

### Features in Each View

- **Breadcrumbs:** Navigate through different sections of the inventory easily.
- **Add/Edit/Delete:** Manage inventory items with options to add, edit, or delete records.
- **Sort & Filter Search:** Sort and filter inventory items based on various criteria.
- **Warehouse View Specific Features:**
  - **Current/Max Capacity:** View the current and maximum capacity of each warehouse.

### Responsiveness

The system is designed to be fully responsive, ensuring a seamless user experience across different devices and screen sizes.

### Edge Cases: Warehouse at capacity

- **IL1:** This warehouse is an example of a full warehouse. The system handles this by disabling the ability to add a new inventory item as it would exceed max capacity.

## Testing

### Methods

This application has been thoroughly tested in the following ways:

- Unit and unit integration tests on front-end with Jest
- Unit and unit integration tests on back-end with TestNG
- Functional testing with Selenium and Cucumber ([Functional test repo](https://github.com/daniel413x/project-two-functional-tests))
- Performance testing with Jmeter ([Jmeter test repo](https://github.com/daniel413x/project-two-performance-tests))
- Vulnerability testing with BurpSuite
- Static code analysis with SonarCloud (see more in _Reports_)

### Reports

For more information, test reports can be found at the following links:

- [Cucumber Reports (Jenkins pipeline-run tests)](https://reports.cucumber.io/report-collections/4836ff78-3584-4e46-8548-5e7674dc4321)
- [SonarCloud Frontend Analysis](https://sonarcloud.io/project/overview?id=brittshook_inventory-mgmt-p1)
- [SonarCloud Backend Analysis](https://sonarcloud.io/project/overview?id=brittshook_inventory-mgmt-p1)

## Deployment

This project is live [here](http://crag-supply-co-client.s3-website-us-east-1.amazonaws.com/) and deployed using the following setup:

### CI/CD with Jenkins

The CI/CD pipeline is managed using Jenkins, which automates the process of building, testing, and deploying the application. Jenkins is integrated with GitHub to trigger pipeline runs upon each push to the repository, ensuring that new code is automatically tested and deployed.

### Infrastructure

- Backend Deployment: Deployed using AWS Elastic Beanstalk on EC2 instances. Elastic Beanstalk manages the scaling, load balancing, and environment health of the Java Spring Boot backend.

- Frontend Deployment: Deployed to AWS S3. The React frontend is hosted as a static website, taking advantage of S3's static hosting features for high availability and performance.

- Database: Amazon RDS is used for the database layer. RDS ensures scalable and secure database management for the inventory system.