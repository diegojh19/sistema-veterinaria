package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.multipart.MultipartFile;
import sistema.veterinaria.backend.domain.model.Customer;
import sistema.veterinaria.backend.domain.model.Patients;
import sistema.veterinaria.backend.domain.port.IPatientsRepository;

import java.io.IOException;
import java.util.List;

public class PatientsService {
    @Autowired
    private final IPatientsRepository iPatientsRepository;
    private final UploadFile uploadFile;

    public PatientsService(IPatientsRepository iPatientsRepository, UploadFile uploadFile) {
        this.iPatientsRepository = iPatientsRepository;
        this.uploadFile = uploadFile;
    }

    public Patients save(Patients patients,  MultipartFile multipartFile) throws IOException {

        if (patients.getId() != null && patients.getId() > 0) {
            if(multipartFile==null) {
                patients.setPhoto_patients("http://localhost:8085/images/default.jpg");
            }else{
                String nameFile = patients.getPhoto_patients().substring(29);
                if (!nameFile.equals("default.jpg")){
                    uploadFile.delete(nameFile);

                }
                patients.setPhoto_patients(uploadFile.upload(multipartFile));
            }
        }else{
           patients.setPhoto_patients(uploadFile.upload(multipartFile));
        }
        return iPatientsRepository.save(patients);
    }

    public Patients update(Integer id, Patients patients){
        return iPatientsRepository.save(patients);
    }

    public Iterable<Patients> findAll(){
        return iPatientsRepository.findAll();
    }

    public Patients findById(Integer id){
        return iPatientsRepository.findById(id);
    }

    public void deleteById(Integer id) {
        // Busca el cliente en la base de datos
        Patients patients = findById(id);

        // Asegúrate de que el cliente tenga una foto válida
        if (patients != null && patients.getPhoto_patients() != null) {
            String photoPath = patients.getPhoto_patients();

            // Verifica que la cadena tenga al menos 29 caracteres
            if (photoPath.length() > 29) {
                String nameFile = photoPath.substring(29);

                // Verifica que la foto no sea "default.jpg" antes de eliminarla
                if (!nameFile.equals("default.jpg")) {
                    uploadFile.delete(nameFile); // Llama al método para eliminar el archivo
                }
            } else {
                System.out.println("La ruta de la foto es demasiado corta para extraer el nombre del archivo.");
            }
        }

        // Elimina el cliente de la base de datos
        iPatientsRepository.deleteById(id);
    }

    public void deleteMultiplesPatients(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iPatientsRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los pacientes");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los pacientes");
        }
    }

}
