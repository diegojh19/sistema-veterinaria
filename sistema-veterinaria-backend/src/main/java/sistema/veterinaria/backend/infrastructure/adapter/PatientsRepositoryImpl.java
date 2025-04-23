package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Patients;
import sistema.veterinaria.backend.domain.port.IPatientsRepository;
import sistema.veterinaria.backend.infrastructure.mapper.PatientsMapper;

import java.util.List;

@Repository
public class PatientsRepositoryImpl implements IPatientsRepository {

    @Autowired
    private final IPatientsCrudRepository iPatientsCrudRepository;

    @Autowired
    private final PatientsMapper patientsMapper;

    public PatientsRepositoryImpl(IPatientsCrudRepository iPatientsCrudRepository, PatientsMapper patientsMapper) {
        this.iPatientsCrudRepository = iPatientsCrudRepository;
        this.patientsMapper = patientsMapper;
    }

    @Override
    public Patients save(Patients patients) {
        return patientsMapper.toPatients(iPatientsCrudRepository.save(patientsMapper.toPatientsEntity(patients)));
    }

    @Override
    public Patients update(Integer id, Patients patients) {
        iPatientsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Patients no encontrado con id: " +id)
        );
        patients.setId(id);
        return patientsMapper.toPatients(iPatientsCrudRepository.save(patientsMapper.toPatientsEntity(patients)));
    }

    @Override
    public Iterable<Patients> findAll() {
        return patientsMapper.toPatientsList(iPatientsCrudRepository.findAll());
    }

    @Override
    public Patients findById(Integer id) {
        return patientsMapper.toPatients(iPatientsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("patients con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iPatientsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("patients con id"+id+ " no existe")
        );
        iPatientsCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iPatientsCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
