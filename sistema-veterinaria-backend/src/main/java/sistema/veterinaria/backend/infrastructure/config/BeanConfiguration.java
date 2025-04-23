package sistema.veterinaria.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sistema.veterinaria.backend.application.*;
import sistema.veterinaria.backend.domain.port.*;

@Configuration

public class BeanConfiguration {

    @Bean
    public SpeciesService speciesService(ISpeciesRepository iSpeciesRepository) {
        return new SpeciesService(iSpeciesRepository);
    }

    @Bean
    public BreedService breedService(IBreedRepository iBreedRepository){
        return new BreedService(iBreedRepository);
    }
    @Bean
    public CustomerService customerService(ICustomerRepository iCustomerRepository, UploadFile uploadFile){
        return new CustomerService(iCustomerRepository, uploadFile);
    }

    @Bean
    public UploadFile uploadFile(){
        return new UploadFile();
    }

    @Bean
    public PatientsService patientsService(IPatientsRepository iPatientsRepository, UploadFile uploadFile){
        return new PatientsService(iPatientsRepository, uploadFile);
    }

    @Bean
    public ShiftsService shiftsService(IShiftsRepository iShiftsRepository){
        return new ShiftsService(iShiftsRepository);
    }
    @Bean
    public QueriesService queriesService(IQueriesRepository iQueriesRepository){
        return new QueriesService(iQueriesRepository);
    }
    @Bean
    public DiagnosisService diagnosisService(IDiagnosisRepository iDiagnosisRepository){
        return new DiagnosisService(iDiagnosisRepository);
    }

    @Bean
    public TreatmentsService treatmentsService(ITreatmentsRepository iTreatmentsRepository){
        return new TreatmentsService(iTreatmentsRepository);
    }
    @Bean
    public CategoryService categoryService(ICategoryRepository iCategoryRepository){
        return new CategoryService(iCategoryRepository);
    }
    @Bean
    public ProductsService productsService(IProductsRepository iProductsRepository){
        return new ProductsService(iProductsRepository);
    }

    @Bean
    public RecipesService recipesService(IRecipesRepository iRecipesRepository){
        return new RecipesService(iRecipesRepository);
    }

    @Bean
    public ExamsService examsService(IExamsRepository iExamsRepository){
        return new ExamsService(iExamsRepository);
    }

    @Bean
    public UserService userService(IUserRepository iUserRepository){
        return new UserService(iUserRepository);
    }

    @Bean
    public  RegistrationService registrationService(IUserRepository iUserRepository){
        return new RegistrationService(iUserRepository);
    }
}
