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

    @BeforeMethod
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindProductById() {
        Product product = new Product();
        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));

        Optional<Product> result = productService.findById(product.getId());

        // assertEquals(result.getName(), "Sample Product");
        // verify(productRepository, times(1)).findById(1L);
    }
}