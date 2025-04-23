package sistema.veterinaria.backend.infrastructure.rest;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder errorMessages = new StringBuilder();

        // Recorre todos los errores de validación
        for (ObjectError error : ex.getBindingResult().getAllErrors()) {
            errorMessages.append(error.getDefaultMessage()).append("\n");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString());
    }

    // Para otros tipos de excepciones
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolationException(ConstraintViolationException ex) {
        StringBuilder errorMessages = new StringBuilder();

        // Recorre todas las violaciones de la restricción
        ex.getConstraintViolations().forEach(violation -> {
            errorMessages.append(violation.getMessage()).append("\n");
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString());
    }
}
