package com.cragsupplyco.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cragsupplyco.backend.utils.TestDataUtil;

@CrossOrigin(origins = {"http://crag-supply-co-client.s3-website-us-east-1.amazonaws.com", "http://localhost:5173"})
@RestController
@RequestMapping("/api/testing")
public class TestingController {

    final private TestDataUtil testDataUtil;

    public TestingController(TestDataUtil testDataUtil) {
        this.testDataUtil = testDataUtil;
    }

    @PostMapping("/reset")
    @ResponseStatus(code = HttpStatus.OK)
    public void reset() {
        this.testDataUtil.clearDatabase();
        this.testDataUtil.generateTestData();
    }
}
