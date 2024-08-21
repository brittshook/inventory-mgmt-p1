import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.testng.Assert.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.repositories.ProductRepository;
import com.cragsupplyco.backend.services.ProductService;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

public class ProductServiceTests {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    Product product;

    Product emptyProduct;

    @BeforeMethod
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        this.product = new Product();
        this.product.setName("Climbing shoes");
        this.product.setBrand("PenguinPro");
        this.product.setId(1);
    }

    @Test
    public void testFindProductByExistingId() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        Optional<Product> result = productService.findById(product.getId());
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindProductByNonExistantId() {
        Optional<Product> result = productService.findById(2);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testFindByBrandAndName() {
        when(productRepository.findByBrandAndName(product.getBrand(), product.getName())).thenReturn(Optional.of(product));
        Optional<Product> result = productService.findByBrandAndName(product.getBrand(), product.getName());
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindByBrandAndNonExistantName() {
        Optional<Product> result = productService.findByBrandAndName(product.getBrand(), "");
        assertFalse(result.isPresent());
    }
}
