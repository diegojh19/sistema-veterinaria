package sistema.veterinaria.backend.application;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Recipes;
import sistema.veterinaria.backend.domain.port.IRecipesRepository;
import sistema.veterinaria.backend.infrastructure.Entity.RecipesEntity;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


public class RecipesService {

    private final IRecipesRepository iRecipesRepository;

    public RecipesService(IRecipesRepository iRecipesRepository) {
        this.iRecipesRepository = iRecipesRepository;
    }

    public Recipes save(Recipes recipes){
        return iRecipesRepository.save(recipes);
    }
    public Recipes update(Recipes recipes){
        return iRecipesRepository.save(recipes);
    }
    public Iterable<Recipes> findAll(){
        return iRecipesRepository.findAll();
    }
    public Recipes findById(Integer id){
        return iRecipesRepository.findById(id);
    }
    public void deleteById(Integer id){
        iRecipesRepository.deleteById(id);
    }


    public byte[] generatePdf(RecipesEntity recipes) throws IOException {
        // Crear el documento y la página
        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);  // Usa tamaño A4
        document.addPage(page);

        // Crear el flujo de contenido para la página
        PDPageContentStream contentStream = new PDPageContentStream(document, page);

        // Comenzar a escribir el texto
        contentStream.beginText();

        // Título "Receta" centrado
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18); // Fuente negrita y tamaño 18
        contentStream.setNonStrokingColor(Color.BLACK); // Color del texto negro

        // Calcular el ancho del título "Receta"
        String title = "Receta";
        float titleWidth = PDType1Font.HELVETICA_BOLD.getStringWidth(title) / 1000 * 18; // Ancho del texto "Receta" en puntos
        float centerX = (PDRectangle.A4.getWidth() - titleWidth) / 2; // Calcular la posición horizontal centrada

        // Establecer la posición inicial en la página para el título centrado
        contentStream.newLineAtOffset(centerX, 800);  // Ajusta la posición vertical (800)

        // Mostrar el título centrado
        contentStream.showText(title);
        contentStream.newLine();

        // Establecer la fuente para el cuerpo del texto
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16); // Título de la receta con fuente en negrita y tamaño 16
        contentStream.setNonStrokingColor(Color.BLACK); // Color del texto negro

        // Receta No. (Alineado a la izquierda)
        contentStream.newLineAtOffset(-centerX + 50, -30);  // Alinear a la izquierda desde la posición del título

        // Establecer la fuente para el cuerpo del texto
        contentStream.setFont(PDType1Font.HELVETICA, 12);  // Fuente normal para el cuerpo con tamaño 12
        contentStream.setNonStrokingColor(Color.DARK_GRAY); // Color gris oscuro para el cuerpo del texto

        // Fecha actual del sistema
        String currentDate = new SimpleDateFormat("dd/MM/yyyy").format(new Date()); // Obtén la fecha actual del sistema

        // Establecer la fuente en negrita para la palabra "Fecha"
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);  // Fuente negrita y tamaño 12
        contentStream.newLineAtOffset(0, -20);  // Mover hacia abajo para escribir el texto

        // Mostrar "Fecha: " en negrita
        contentStream.showText("Fecha: ");

        // Cambiar la fuente a normal para la fecha
        contentStream.setFont(PDType1Font.HELVETICA, 12);  // Fuente normal (no en negrita) y tamaño 12
        contentStream.showText(currentDate);  // Mostrar la fecha actual
        contentStream.newLine();  // Nueva línea después de la fecha


        // Paciente
        String patientName = recipes.getPatientsEntity().getName_patients(); // Aquí accedemos al nombre del paciente

        // Establecer la fuente en negrita para la palabra "Paciente"
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);  // Fuente negrita y tamaño 12
        contentStream.newLineAtOffset(0, -40);  // Mover hacia abajo para escribir el texto

        // Mostrar "Paciente: " en negrita
        contentStream.showText("Paciente: ");

        // Cambiar la fuente a normal para el nombre del paciente (sin negrita)
        contentStream.setFont(PDType1Font.HELVETICA, 12);  // Fuente normal (no en negrita) y tamaño 12
        contentStream.showText(patientName);  // Mostrar el nombre del paciente sin negrita
        contentStream.newLine();  // Nueva línea después del nombre del paciente


        // Cerrar el bloque de texto
        contentStream.endText();

        // Dibujar una línea para separar secciones
        float lineStartX = 50; // Posición de inicio en X
        float lineStartY = 680; // Posición de inicio en Y (donde termina el texto anterior)
        float lineEndX = 500; // Longitud de la línea

        contentStream.setLineWidth(1f); // Grosor de la línea
        contentStream.setStrokingColor(Color.GRAY); // Color de la línea



        // Escribir la palabra "Descripción" fuera del cuadro
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);  // Fuente para el texto
        contentStream.setNonStrokingColor(Color.BLACK);  // Color del texto
        contentStream.newLineAtOffset(50, lineStartY -1);  // Posiciona "Descripción" fuera del cuadro
        contentStream.showText("Descripción:");  // Muestra la palabra "Descripción"
        contentStream.endText();

        // Dibujar el cuadro para la descripción (sin la palabra "Descripción")
        float rectX = 50;  // Posición horizontal del rectángulo
        float rectY = lineStartY - 10;  // Posición vertical del rectángulo (debajo de la palabra "Descripción")
        float rectWidth = 460;  // Ancho del rectángulo
        float rectHeight = 60;  // Altura del rectángulo

        contentStream.setLineWidth(1f);  // Grosor de la línea del rectángulo
        contentStream.setStrokingColor(Color.BLACK);  // Color negro para el rectángulo
        contentStream.setNonStrokingColor(new Color(255, 255, 255)); // Rellenar el rectángulo con blanco

        // Dibuja el rectángulo
        contentStream.moveTo(rectX, rectY);  // Mueve a la posición inicial
        contentStream.lineTo(rectX + rectWidth, rectY);  // Línea superior
        contentStream.lineTo(rectX + rectWidth, rectY - rectHeight);  // Línea derecha
        contentStream.lineTo(rectX, rectY - rectHeight);  // Línea inferior
        contentStream.closePath();  // Cierra el rectángulo
        contentStream.stroke();  // Dibuja el contorno del rectángulo
        contentStream.fill(); // Rellena el rectángulo con color blanco

        // Escribir la descripción dentro del rectángulo
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA, 12);  // Fuente para el texto
        contentStream.setNonStrokingColor(Color.BLACK);  // Color del texto
        contentStream.newLineAtOffset(rectX + 5, rectY - 20);  // Ajusta la posición del texto dentro del rectángulo
        contentStream.showText(recipes.getDescription()); // Muestra la descripción dentro del cuadro
        contentStream.endText();





        // Escribir la palabra "Indicaciones" fuera del cuadro
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);  // Fuente para el texto
        contentStream.setNonStrokingColor(Color.BLACK);  // Color del texto
        contentStream.newLineAtOffset(50, rectY - rectHeight - 40);  // Subir la palabra "Indicaciones" más
        contentStream.showText("Indicaciones:");  // Muestra la palabra "Indicaciones"
        contentStream.endText();

// Dibujar el cuadro para las indicaciones (con el texto "Indicaciones")
        float rectIndicationsX = 50;  // Posición horizontal del rectángulo de las indicaciones
        float rectIndicationsY = rectY - rectHeight - 50;  // Subir el rectángulo de las indicaciones más
        float rectIndicationsWidth = 460;  // Ancho del rectángulo
        float rectIndicationsHeight = 60;  // Altura del rectángulo

        contentStream.setLineWidth(1f);  // Grosor de la línea del rectángulo
        contentStream.setStrokingColor(Color.BLACK);  // Color negro para el rectángulo
        contentStream.setNonStrokingColor(new Color(255, 255, 255)); // Rellenar el rectángulo con blanco

// Dibuja el rectángulo de las indicaciones
        contentStream.moveTo(rectIndicationsX, rectIndicationsY);  // Mueve a la posición inicial
        contentStream.lineTo(rectIndicationsX + rectIndicationsWidth, rectIndicationsY);  // Línea superior
        contentStream.lineTo(rectIndicationsX + rectIndicationsWidth, rectIndicationsY - rectIndicationsHeight);  // Línea derecha
        contentStream.lineTo(rectIndicationsX, rectIndicationsY - rectIndicationsHeight);  // Línea inferior
        contentStream.closePath();  // Cierra el rectángulo
        contentStream.stroke();  // Dibuja el contorno del rectángulo
        contentStream.fill(); // Rellena el rectángulo con color blanco

// Escribir las indicaciones dentro del rectángulo
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA, 12);  // Fuente para el texto
        contentStream.setNonStrokingColor(Color.BLACK);  // Color del texto
        contentStream.newLineAtOffset(rectIndicationsX + 5, rectIndicationsY - 20);  // Ajusta la posición del texto dentro del rectángulo
        contentStream.showText(recipes.getIndications()); // Muestra las indicaciones dentro del rectángulo
        contentStream.endText();







        // Cerrar el flujo de contenido
        contentStream.close();

        // Guardar el documento en un array de bytes
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        document.save(byteArrayOutputStream);
        document.close();

        return byteArrayOutputStream.toByteArray();  // Retornar el PDF como array de bytes
    }

    public void deleteMultiplesRecipes(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iRecipesRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las recetas");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las recetas");
        }
    }

}