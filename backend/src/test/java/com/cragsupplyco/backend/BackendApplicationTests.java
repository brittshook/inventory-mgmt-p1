package com.cragsupplyco.backend;

import org.testng.Assert;
import org.testng.annotations.Test;

class BackendApplicationTests {

    @Test
    public void test() {
        int a = 5;
        int b = 10;
        int result = a + b;
        Assert.assertEquals(result, 15, "The addition result should be 15");
    }

}
