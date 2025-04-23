package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Queries;
import sistema.veterinaria.backend.domain.port.IQueriesRepository;
import sistema.veterinaria.backend.infrastructure.mapper.QueriesMapper;

import java.util.List;

@Repository
public class QueriesRepositoryImpl implements IQueriesRepository {

    @Autowired
    private final IQueriesCrudRepository iQueriesCrudRepository;

    @Autowired
    private final QueriesMapper queriesMapper;

    public QueriesRepositoryImpl(IQueriesCrudRepository iQueriesCrudRepository, QueriesMapper queriesMapper) {
        this.iQueriesCrudRepository = iQueriesCrudRepository;
        this.queriesMapper = queriesMapper;
    }

    @Override
    public Queries save(Queries queries) {
        return queriesMapper.toQueries(iQueriesCrudRepository.save(queriesMapper.toQueriesEntity(queries)));
    }

    @Override
    public Queries update(Integer id, Queries queries) {
        iQueriesCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Query no encontrada con id: " + id)
        );
        queries.setId(id);

        return queriesMapper.toQueries(iQueriesCrudRepository.save(queriesMapper.toQueriesEntity(queries)));
    }

    @Override
    public Iterable<Queries> findAll() {
        return queriesMapper.toCategoryList(iQueriesCrudRepository.findAll());
    }

    @Override
    public Queries findById(Integer id) {
        return queriesMapper.toQueries(iQueriesCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Queries con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iQueriesCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Queries con id "+id+ " no existe")
        );
        iQueriesCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iQueriesCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
