package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Patients;

import java.util.List;

public interface IPatientsRepository {

    Patients save(Patients patients);
    Patients update(Integer id, Patients patients);
    Iterable<Patients> findAll();
    Patients findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
