package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Diagnosis;
import sistema.veterinaria.backend.domain.port.IDiagnosisRepository;

import java.util.List;

public class DiagnosisService {

    @Autowired
    private final IDiagnosisRepository iDiagnosisRepository;

    public DiagnosisService(IDiagnosisRepository iDiagnosisRepository) {
        this.iDiagnosisRepository = iDiagnosisRepository;

    }
    public Diagnosis save(Diagnosis diagnosis){
        return iDiagnosisRepository.save(diagnosis);
    }

    public Diagnosis update(Integer Id, Diagnosis diagnosis){
        return iDiagnosisRepository.save(diagnosis);
    }

    public Iterable<Diagnosis> findAll(){
        return iDiagnosisRepository.findAll();
    }

    public Diagnosis findById(Integer id){
        return iDiagnosisRepository.findById(id);
    }

    public void deleteById(Integer id){
        iDiagnosisRepository.deleteById(id);
    }

    public void deleteMultiplesDiagnosis(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iDiagnosisRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los diagnosticos");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los diagnosticos");
        }
    }
}
