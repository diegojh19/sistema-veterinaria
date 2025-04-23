package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Treatments;
import sistema.veterinaria.backend.domain.port.ITreatmentsRepository;
import sistema.veterinaria.backend.infrastructure.mapper.TreatmentsMapper;

import java.util.List;

@Repository
public class TreatmentsRepositoryImpl implements ITreatmentsRepository {

    @Autowired
    private final ITreatmentsCrudRepository iTreatmentsCrudRepository;

    @Autowired
    private final TreatmentsMapper treatmentsMapper;

    public TreatmentsRepositoryImpl(ITreatmentsCrudRepository iTreatmentsCrudRepository, TreatmentsMapper treatmentsMapper) {
        this.iTreatmentsCrudRepository = iTreatmentsCrudRepository;
        this.treatmentsMapper = treatmentsMapper;
    }

    @Override
    public Treatments save(Treatments treatments) {
        return treatmentsMapper.toTreatments(iTreatmentsCrudRepository.save(treatmentsMapper.toTreatmentsEntity(treatments)));
    }

    @Override
    public Treatments update(Integer id, Treatments treatments) {
        iTreatmentsCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Treatments no encontrada con id: " + id)
        );
        treatments.setId(id);
        return treatmentsMapper.toTreatments(iTreatmentsCrudRepository.save(treatmentsMapper.toTreatmentsEntity(treatments)));
    }

    @Override
    public Iterable<Treatments> findAll() {
        return treatmentsMapper.toTreatmentsList(iTreatmentsCrudRepository.findAll());
    }

    @Override
    public Treatments findById(Integer id) {
        return treatmentsMapper.toTreatments(iTreatmentsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Treatments con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iTreatmentsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Treatments con id "+id+ " no existe")
        );
        iTreatmentsCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iTreatmentsCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
