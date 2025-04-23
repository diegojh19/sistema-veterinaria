package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Diagnosis;
import sistema.veterinaria.backend.domain.port.IDiagnosisRepository;
import sistema.veterinaria.backend.infrastructure.mapper.DiagnosisMapper;

import java.util.List;

@Repository
public class DiagnosisRepositoryImpl implements IDiagnosisRepository {

    @Autowired
    private final IDiagnosisCrudRepository iDiagnosisCrudRepository;

    @Autowired
    private final DiagnosisMapper diagnosisMapper;

    public DiagnosisRepositoryImpl(IDiagnosisCrudRepository iDiagnosisCrudRepository, DiagnosisMapper diagnosisMapper) {
        this.iDiagnosisCrudRepository = iDiagnosisCrudRepository;
        this.diagnosisMapper = diagnosisMapper;
    }

    @Override
    public Diagnosis save(Diagnosis diagnosis) {
        return diagnosisMapper.toDiagnosis(iDiagnosisCrudRepository.save(diagnosisMapper.toDiagnosisEntity(diagnosis)));
    }

    @Override
    public Diagnosis update(Integer id, Diagnosis diagnosis) {
        iDiagnosisCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Diagnosis no encontrada con id: " + id)
        );
        diagnosis.setId(id);

        return diagnosisMapper.toDiagnosis(iDiagnosisCrudRepository.save(diagnosisMapper.toDiagnosisEntity(diagnosis)));
    }

    @Override
    public Iterable<Diagnosis> findAll() {
        return diagnosisMapper.toDiagnosisList(iDiagnosisCrudRepository.findAll());
    }

    @Override
    public Diagnosis findById(Integer id) {
        return diagnosisMapper.toDiagnosis(iDiagnosisCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Diagnosis con id "+id+ " no existe")
        ));    }

    @Override
    public void deleteById(Integer id) {
        iDiagnosisCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Diagnosis con id"+id+ " no existe")
        );
        iDiagnosisCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iDiagnosisCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
