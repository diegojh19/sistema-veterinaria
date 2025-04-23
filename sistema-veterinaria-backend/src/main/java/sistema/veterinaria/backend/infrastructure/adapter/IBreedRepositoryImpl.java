package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.port.IBreedRepository;
import sistema.veterinaria.backend.infrastructure.mapper.BreedMapper;

import java.util.List;

@Repository
public class IBreedRepositoryImpl implements IBreedRepository {
    @Autowired
    private final IBreedCrudRepository iBreedCrudRepository;

    @Autowired
    private final BreedMapper breedMapper;

    public IBreedRepositoryImpl(IBreedCrudRepository iBreedCrudRepository, BreedMapper breedMapper) {
        this.iBreedCrudRepository = iBreedCrudRepository;
        this.breedMapper = breedMapper;

    }

    @Override
    public Breed save(Breed breed) {
        return breedMapper.toBreed(iBreedCrudRepository.save(breedMapper.tobreedEntity(breed)));

    }

    @Override
    public Breed update(Integer id, Breed breed) {
        iBreedCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("breeds no encontrada con id: " + id)
        );
        breed.setId(id);

        return breedMapper.toBreed(iBreedCrudRepository.save(breedMapper.tobreedEntity(breed)));
    }


    @Override
    public Iterable<Breed> findAll() {
        return breedMapper.toBreedList(iBreedCrudRepository.findAll());
    }

    @Override
    public Breed findById(Integer id) {
        return breedMapper.toBreed(iBreedCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("breed con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iBreedCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("breed con id"+id+ " no existe")
        );
        iBreedCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iBreedCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}