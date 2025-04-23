package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Shifts;
import sistema.veterinaria.backend.domain.port.IShiftsRepository;

import java.util.List;

public class ShiftsService {

    @Autowired
    private final IShiftsRepository iShiftsRepository;

    public ShiftsService(IShiftsRepository iShiftsRepository) {
        this.iShiftsRepository = iShiftsRepository;
    }

    public Shifts save(Shifts shifts){
        return iShiftsRepository.save(shifts);
    }
    public  Shifts update(Integer id,  Shifts shifts){
        return iShiftsRepository.save(shifts);
    }
    public Iterable< Shifts> findAll(){
        return iShiftsRepository.findAll();
    }
    public  Shifts findById(Integer id){
        return iShiftsRepository.findById(id);
    }
    public void deleteById(Integer id){
        iShiftsRepository.deleteById(id);
    }

    public void deleteMultiplesShifts(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iShiftsRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los turnos");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los turnos");
        }
    }
}
