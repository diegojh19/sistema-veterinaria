package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Exams;
import sistema.veterinaria.backend.domain.port.IExamsRepository;
import sistema.veterinaria.backend.infrastructure.mapper.ExamsMapper;

import java.util.List;

@Repository
public class ExamsRepositoryImpl implements IExamsRepository {

    @Autowired
    private final IExamsCrudRepository iExamsCrudRepository;

    @Autowired
    private final ExamsMapper examsMapper;

    public ExamsRepositoryImpl(IExamsCrudRepository iExamsCrudRepository, ExamsMapper examsMapper) {
        this.iExamsCrudRepository = iExamsCrudRepository;
        this.examsMapper = examsMapper;
    }

    @Override
    public Exams save(Exams exams) {
        return examsMapper.toExams(iExamsCrudRepository.save(examsMapper.toExamsEntity(exams)));
    }

    @Override
    public Exams update(Integer id, Exams exams) {
        iExamsCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Exams no encontrado con id: " + id)
        );
        exams.setId(id);

        return examsMapper.toExams(iExamsCrudRepository.save(examsMapper.toExamsEntity(exams)));
    }

    @Override
    public Iterable<Exams> findAll() {
        return examsMapper.toExamsList(iExamsCrudRepository.findAll());
    }

    @Override
    public Exams findById(Integer id) {
        return examsMapper.toExams(iExamsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Exams con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iExamsCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Exams con id" + id + " no existe")
        );
        iExamsCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iExamsCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
