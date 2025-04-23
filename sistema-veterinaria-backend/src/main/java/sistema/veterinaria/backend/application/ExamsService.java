package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Category;
import sistema.veterinaria.backend.domain.model.Exams;
import sistema.veterinaria.backend.domain.port.ICategoryRepository;
import sistema.veterinaria.backend.domain.port.IExamsRepository;

import java.util.List;

public class ExamsService {

    @Autowired
    private final IExamsRepository iExamsRepository;

    public ExamsService(IExamsRepository iExamsRepository) {
        this.iExamsRepository = iExamsRepository;
    }

    public Exams save(Exams exams){
        return iExamsRepository.save(exams);
    }

    public Exams update(Integer id, Exams exams){
        return iExamsRepository.save(exams);
    }

    public Iterable<Exams> findAll(){
        return iExamsRepository.findAll();
    }

    public Exams findById(Integer id){
        return iExamsRepository.findById(id);
    }

    public void deleteById(Integer id){
        iExamsRepository.deleteById(id);
    }

    public void deleteMultiplesExams(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iExamsRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los examenes");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los examenes");
        }
    }
}
