package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Species;
import sistema.veterinaria.backend.domain.port.ISpeciesRepository;
import sistema.veterinaria.backend.infrastructure.mapper.SpeciesMapper;

import java.util.List;

@Repository
public class SpeciesRepositoryImpl implements ISpeciesRepository {
    @Autowired
    private final ISpeciesCrudRepository iSpeciesCrudRepository;
    @Autowired
    private final SpeciesMapper speciesMapper;

    public SpeciesRepositoryImpl(ISpeciesCrudRepository iSpeciesCrudRepository, SpeciesMapper speciesMapper) {
        this.iSpeciesCrudRepository = iSpeciesCrudRepository;
        this.speciesMapper = speciesMapper;
    }


    @Override
    public Species save(Species species) {
        return speciesMapper.toSpecies(iSpeciesCrudRepository.save(speciesMapper.toSpeciesEntity(species)));
    }

    @Override
    public Species update(Integer id, Species species) {
        iSpeciesCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Especie no encontrada con id: " + id)
        );
        species.setId(id);

        return speciesMapper.toSpecies(iSpeciesCrudRepository.save(speciesMapper.toSpeciesEntity(species)));
    }

    @Override
    public Iterable<Species> findAll() {
        return speciesMapper.toSpeciesList(iSpeciesCrudRepository.findAll());
    }

    @Override
    public Species findById(Integer id) {
        return speciesMapper.toSpecies(iSpeciesCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("specie con id " + id + " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iSpeciesCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("specie con id" + id + " no existe")
        );
        iSpeciesCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iSpeciesCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}