package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Treatments;
import sistema.veterinaria.backend.domain.port.ITreatmentsRepository;

import java.util.List;

public class TreatmentsService {

    @Autowired
    private final ITreatmentsRepository iTreatmentsRepository;

    public TreatmentsService(ITreatmentsRepository iTreatmentsRepository) {
        this.iTreatmentsRepository = iTreatmentsRepository;
    }

    public Treatments save(Treatments treatments){
        return iTreatmentsRepository.save(treatments);
    }

    public Treatments update(Integer id, Treatments treatments){
        return iTreatmentsRepository.save(treatments);
    }

    public Iterable<Treatments> findAll(){
        return iTreatmentsRepository.findAll();
    }

    public Treatments findById(Integer id){
        return iTreatmentsRepository.findById(id);
    }

    public void deleteById(Integer id){
        iTreatmentsRepository.deleteById(id);
    }

    public void deleteMultiplesTreatments(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iTreatmentsRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los tratamientos");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los tratamientos");
        }
    }
}
