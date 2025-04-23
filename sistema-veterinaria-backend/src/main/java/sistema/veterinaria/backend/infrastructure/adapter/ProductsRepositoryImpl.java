package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Products;
import sistema.veterinaria.backend.domain.port.IProductsRepository;
import sistema.veterinaria.backend.infrastructure.mapper.ProductsMapper;

import java.util.List;

@Repository
public class ProductsRepositoryImpl implements IProductsRepository {

    @Autowired
    private final IProductsCrudRepository iProductsCrudRepository;
    private final ProductsMapper productsMapper;


    public ProductsRepositoryImpl(IProductsCrudRepository iProductsCrudRepository, ProductsMapper productsMapper) {
        this.iProductsCrudRepository = iProductsCrudRepository;
        this.productsMapper = productsMapper;
    }

    @Override
    public Products save(Products products) {
        return productsMapper.toProducts(iProductsCrudRepository.save(productsMapper.toProductsEntity(products)));
    }

    @Override
    public Products update(Products products) {
        return productsMapper.toProducts(iProductsCrudRepository.save(productsMapper.toProductsEntity(products)));
    }

    @Override
    public Iterable<Products> findAll() {
        return productsMapper.toProductsList(iProductsCrudRepository.findAll());
    }

    @Override
    public Products findById(Integer id) {
        return productsMapper.toProducts(iProductsCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("products con id" + id + " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iProductsCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("products con id" + id + " no existe")
        );
        iProductsCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iProductsCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
