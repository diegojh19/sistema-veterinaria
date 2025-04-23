package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Treatments;

import java.util.List;

public interface ITreatmentsRepository {
    Treatments save(Treatments treatments);
    Treatments update(Integer id, Treatments treatments);
    Iterable<Treatments> findAll();
    Treatments findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
