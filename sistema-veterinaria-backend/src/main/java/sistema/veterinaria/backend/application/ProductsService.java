package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Products;
import sistema.veterinaria.backend.domain.port.IProductsRepository;

import java.util.List;

public class ProductsService {

    @Autowired
    private final IProductsRepository iProductsRepository;

    public ProductsService(IProductsRepository iProductsRepository) {
        this.iProductsRepository = iProductsRepository;
    }

    public Products save(Products products){
        return iProductsRepository.save(products);
    }

    public Products update(Products products){
        return iProductsRepository.save(products);
    }

    public Iterable<Products> findAll(){
        return iProductsRepository.findAll();
    }

    public Products findById(Integer id){
        return iProductsRepository.findById(id);
    }

    public void deleteById(Integer id){
        iProductsRepository.deleteById(id);
    }

    public void deleteMultiplesProducts(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iProductsRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los productos");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los productos");
        }
    }
}
