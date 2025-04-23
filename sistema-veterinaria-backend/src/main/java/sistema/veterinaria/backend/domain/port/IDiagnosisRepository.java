package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Diagnosis;

import java.util.List;

public interface IDiagnosisRepository {
    Diagnosis save(Diagnosis  diagnosis);
    Diagnosis update(Integer id, Diagnosis diagnosis);
    Iterable<Diagnosis> findAll();
    Diagnosis findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
