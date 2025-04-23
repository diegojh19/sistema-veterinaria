package sistema.veterinaria.backend.application;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import sistema.veterinaria.backend.domain.model.Species;
import sistema.veterinaria.backend.domain.port.ISpeciesRepository;

import java.util.List;

public class SpeciesService {
    @Autowired
    private final ISpeciesRepository iSpeciesRepository;

    public SpeciesService(ISpeciesRepository iSpeciesRepository) {
        this.iSpeciesRepository = iSpeciesRepository;
    }

    public Species save(Species species){
        return iSpeciesRepository.save(species);
    }
    public Species update(Integer id, Species species){
        return iSpeciesRepository.save(species);
    }
    public Iterable<Species> findAll(){
        return iSpeciesRepository.findAll();
    }
    public Species findById(Integer id){
        return iSpeciesRepository.findById(id);
    }
    public void deleteById(Integer id){
        iSpeciesRepository.deleteById(id);
    }
    @Transactional
    public void deleteMultiplesSpecies(List<Integer> ids){
         iSpeciesRepository.deleteAllByIdIn(ids);
    }

}
