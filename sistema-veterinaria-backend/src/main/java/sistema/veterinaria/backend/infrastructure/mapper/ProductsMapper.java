package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Products;
import sistema.veterinaria.backend.infrastructure.Entity.ProductsEntity;

@Mapper(componentModel = "spring")
public interface ProductsMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "name_products", target = "name_products"),
                    @Mapping(source = "description", target = "description"),
                    @Mapping(source = "brand", target = "brand"),
                    @Mapping(source = "price", target = "price"),
                    @Mapping(source = "stock", target = "stock"),
                    @Mapping(source = "expiration_Date", target = "expiration_Date"),
                    @Mapping(source = "dose", target = "dose"),
                    @Mapping(source = "categoryEntity.id", target = "categories_idcategories")


            }
    )
    Products toProducts(ProductsEntity productsEntity);
    Iterable<Products> toProductsList(Iterable<ProductsEntity> productsEntities);

    @InheritInverseConfiguration
    ProductsEntity toProductsEntity(Products products);
}
