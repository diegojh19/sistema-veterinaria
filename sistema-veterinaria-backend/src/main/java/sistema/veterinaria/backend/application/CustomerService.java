package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.multipart.MultipartFile;
import sistema.veterinaria.backend.domain.model.Customer;
import sistema.veterinaria.backend.domain.port.ICustomerRepository;

import java.io.IOException;
import java.util.List;

public class CustomerService {
    @Autowired
    private final ICustomerRepository iCustomerRepository;
    @Autowired
    private final UploadFile uploadFile;


    public CustomerService(ICustomerRepository iCustomerRepository, UploadFile uploadFile) {
        this.iCustomerRepository = iCustomerRepository;
        this.uploadFile = uploadFile;
    }

    public Customer save(Customer customer,  MultipartFile multipartFile) throws IOException {

        if (customer.getId() != null && customer.getId() > 0) {
            if(multipartFile==null) {
                customer.setPhoto_customer("http://localhost:8085/images/default.jpg");
            }else{
                String nameFile = customer.getPhoto_customer().substring(29);
                if (!nameFile.equals("default.jpg")){
                    uploadFile.delete(nameFile);

                }
                customer.setPhoto_customer(uploadFile.upload(multipartFile));
            }
        }else{
            customer.setPhoto_customer(uploadFile.upload(multipartFile));
        }

        return iCustomerRepository.save(customer);
    }

    public Customer update(Integer id, Customer customer){

        return iCustomerRepository.save(customer);
    }

    public Iterable<Customer> findAll(){
        return iCustomerRepository.findAll();
    }

    public Customer findById(Integer id){
        return iCustomerRepository.findById(id);
    }

    public void deleteById(Integer id) {
        // Busca el cliente en la base de datos
        Customer customer = findById(id);

        // Asegúrate de que el cliente tenga una foto válida
        if (customer != null && customer.getPhoto_customer() != null) {
            String nameFile = customer.getPhoto_customer().substring(29);

            // Verifica que la foto no sea "default.jpg" antes de eliminarla
            if (!nameFile.equals("default.jpg")) {
                uploadFile.delete(nameFile); // Llama al método para eliminar el archivo
            }
        }

        // Elimina el cliente de la base de datos
        iCustomerRepository.deleteById(id);
    }

    public void deleteMultiplesCustomers(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iCustomerRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los clientes");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los clientes");
        }
    }

}
