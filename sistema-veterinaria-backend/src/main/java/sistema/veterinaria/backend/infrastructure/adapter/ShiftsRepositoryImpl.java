package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Shifts;
import sistema.veterinaria.backend.domain.port.IShiftsRepository;
import sistema.veterinaria.backend.infrastructure.mapper.ShiftsMapper;

import java.util.List;

@Repository
public class ShiftsRepositoryImpl implements IShiftsRepository {

    @Autowired
    private final IShiftsCrudRepository iShiftsCrudRepository;

    @Autowired
    private final ShiftsMapper shiftsMapper;

    public ShiftsRepositoryImpl(IShiftsCrudRepository iShiftsCrudRepository, ShiftsMapper shiftsMapper) {
        this.iShiftsCrudRepository = iShiftsCrudRepository;
        this.shiftsMapper = shiftsMapper;
    }

    @Override
    public Shifts save(Shifts shifts) {

        return shiftsMapper.toShifts(iShiftsCrudRepository.save(shiftsMapper.toShiftsEntity(shifts)));
    }

    @Override
    public Shifts update(Integer id, Shifts shifts) {
        iShiftsCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Shifts no encontrada con id: " + id)
        );
        shifts.setId(id);

        return shiftsMapper.toShifts(iShiftsCrudRepository.save(shiftsMapper.toShiftsEntity(shifts)));
    }

    @Override
    public Iterable<Shifts> findAll() {
        return shiftsMapper.toShiftsList(iShiftsCrudRepository.findAll());
    }

    @Override
    public Shifts findById(Integer id) {
        return shiftsMapper.toShifts(iShiftsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("shifts con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iShiftsCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("shifts con id "+id+ " no existe")
        );
        iShiftsCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iShiftsCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
