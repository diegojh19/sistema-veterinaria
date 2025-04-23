package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.model.Queries;
import sistema.veterinaria.backend.domain.port.IBreedRepository;
import sistema.veterinaria.backend.domain.port.IQueriesRepository;

import java.util.List;

public class QueriesService {

    @Autowired
    private final IQueriesRepository iQueriesRepository;

    public QueriesService(IQueriesRepository iQueriesRepository) {
        this.iQueriesRepository = iQueriesRepository;
    }

    public Queries save(Queries queries){
        return iQueriesRepository.save(queries);
    }
    public Queries update(Integer id, Queries queries){
        return iQueriesRepository.save(queries);
    }
    public Iterable<Queries> findAll(){
        return iQueriesRepository.findAll();
    }
    public Queries findById(Integer id){
        return iQueriesRepository.findById(id);
    }
    public void deleteById(Integer id){
        iQueriesRepository.deleteById(id);
    }

    public void deleteMultiplesQueries(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iQueriesRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las consultas");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las consultas");
        }
    }
}
