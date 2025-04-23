package sistema.veterinaria.backend.application;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.port.IBreedRepository;

import java.util.List;

public class BreedService {
    @Autowired
    private final IBreedRepository iBreedRepository;

    public BreedService(IBreedRepository iBreedRepository) {
        this.iBreedRepository = iBreedRepository;
    }

    public Breed save(Breed breed){
        return iBreedRepository.save(breed);
    }
    public Breed update(Integer id, Breed breed){
        return iBreedRepository.save(breed);
    }
    public Iterable<Breed> findAll(){
        return iBreedRepository.findAll();
    }
    public Breed findById(Integer id){
        return iBreedRepository.findById(id);
    }
    public void deleteById(Integer id){
        iBreedRepository.deleteById(id);
    }

    public void deleteMultiplesBreeds(List<Integer> ids) {
        try {
            for (Integer id : ids) {
               iBreedRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las razas");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las razas");
        }
    }

}
