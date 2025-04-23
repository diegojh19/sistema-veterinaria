package sistema.veterinaria.backend.domain.port;


import sistema.veterinaria.backend.domain.model.Exams;

import java.util.List;

public interface IExamsRepository {

    Exams save(Exams exams);

    Exams update(Integer id, Exams exams);

    Iterable<Exams> findAll();

    Exams findById(Integer id);

    void deleteById(Integer  id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
