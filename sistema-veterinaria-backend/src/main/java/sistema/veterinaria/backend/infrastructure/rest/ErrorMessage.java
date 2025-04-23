package sistema.veterinaria.backend.infrastructure.rest;

public class ErrorMessage {

    private String message;

    // Constructor
    public ErrorMessage(String message) {
        this.message = message;
    }

    // Getter
    public String getMessage() {
        return message;
    }

    // Setter
    public void setMessage(String message) {
        this.message = message;
    }

}
