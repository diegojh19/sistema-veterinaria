package sistema.veterinaria.backend.infrastructure.emailverification.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender emailSender;  // Autowired para inyectar JavaMailSender

    @Value("${spring.mail.username}")
    private String remitente;

    public void sendVerificationEmail(String correo, String token) {
        String verificationUrl = "http://localhost:4200/verify?token=" + token;
        String message = "Haz clic en el siguiente enlace para verificar tu correo: " + verificationUrl;

        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();  // Crear un MimeMessage
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");  // Ayuda para enviar el mensaje

            helper.setFrom(remitente);  // Establecer el remitente
            helper.setTo(correo);  // Establecer el destinatario
            helper.setSubject("Verificación de correo electrónico");  // Establecer el asunto
            helper.setText(message, true);  // Establecer el contenido del mensaje (true significa que es HTML)

            emailSender.send(mimeMessage);  // Enviar el correo

            System.out.println("Correo enviado a: " + correo);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error al enviar el correo: " + e.getMessage());
        }
    }

    public void sendPasswordChangeNotification(String correo) {
        // Asunto del correo
        //  String subject = "Notificación de cambio de contraseña";

        // Contenido del correo
        String message = "Hola,\n\n"
                + "Queremos informarte que la contraseña de tu cuenta ha sido cambiada correctamente. "
                + "Si no realizaste este cambio, por favor contacta con nuestro equipo de soporte inmediatamente.\n\n"
                + "Gracias,\nEl equipo de soporte";

        // Enviar el correo
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();  // Crear un MimeMessage
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");  // Ayuda para enviar el mensaje

            helper.setFrom(remitente);  // Establecer el remitente
            helper.setTo(correo);  // Establecer el destinatario
            helper.setSubject("Notificación de cambio de contraseña");  // Establecer el asunto
            helper.setText(message, true);  // Establecer el contenido del mensaje (true significa que es HTML)

            emailSender.send(mimeMessage);  // Enviar el correo

            System.out.println("Correo enviado a: " + correo);
        } catch (Exception e) {
            System.err.println("Error al enviar la notificación de cambio de contraseña: " + e.getMessage());
            throw new RuntimeException("Error enviando correo de notificación.");
        }
    }

}

