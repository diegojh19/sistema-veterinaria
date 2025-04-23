package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.ProductsService;
import sistema.veterinaria.backend.domain.model.Products;
import sistema.veterinaria.backend.domain.model.Recipes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductsController {

    @Autowired
    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @PostMapping
    public ResponseEntity<Products> save(@RequestBody Products products){
        return new ResponseEntity<>(productsService.save(products), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<Iterable<Products>> findAll(){
        return ResponseEntity.ok(productsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> findById(@PathVariable Integer id){
        return ResponseEntity.ok(productsService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        productsService.deleteById(id);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProducts(@PathVariable Integer id, @RequestBody Products products) {
        Products updateProducts = productsService.findById(id);

        if (products.getName_products() != null) {
            updateProducts.setName_products(products.getName_products());
        }

        if (products.getDescription() != null) {
            updateProducts.setDescription(products.getDescription());
        }

        if (products.getBrand() != null) {
            updateProducts.setBrand(products.getBrand());
        }

        if (products.getPrice() != null) {
            updateProducts.setPrice(products.getPrice());
        }

        if (products.getStock() != null) {
            updateProducts.setStock(products.getStock());
        }

        if (products.getExpiration_Date() != null) {
            updateProducts.setExpiration_Date(products.getExpiration_Date());
        }
        if (products.getDose() != null) {
            updateProducts.setDose(products.getDose());
        }

        if (products.getCategories_idcategories() != null) {
            updateProducts.setCategories_idcategories(products.getCategories_idcategories());
        }

        productsService.save(updateProducts);

        return ResponseEntity.ok(updateProducts);

    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultiplebreeds(@RequestBody List<Integer> ids) {
        try {
            productsService.deleteMultiplesProducts(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "productos eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los productos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
