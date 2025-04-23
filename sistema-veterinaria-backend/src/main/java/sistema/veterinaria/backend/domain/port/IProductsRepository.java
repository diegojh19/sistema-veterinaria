package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Products;

import java.util.List;

public interface IProductsRepository {

    Products save(Products products);
    Products update(Products products);
    Iterable<Products> findAll();
    Products findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
