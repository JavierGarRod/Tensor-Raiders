package tensor.raiders.backend.model;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class EquipoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "El nombre del equipo es obligatorio")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
        private String nombre;

        @NotNull(message = "El nivel es obligatorio")
        private Equipo.Nivel nivel;

        @Size(max = 300, message = "La descripción no puede superar 300 caracteres")
        private String descripcion;

        @NotEmpty(message = "Debe haber al menos un participante")
        @Size(max = 20, message = "El equipo no puede tener más de 20 participantes")
        private List<@NotBlank(message = "El nombre del participante no puede estar vacío") String> participantes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String nombre;
        private Equipo.Nivel nivel;
        private String descripcion;
        private List<String> participantes;
        private int numParticipantes;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaActualizacion;

        public static Response fromEntity(Equipo e) {
            return Response.builder()
                    .id(e.getId())
                    .nombre(e.getNombre())
                    .nivel(e.getNivel())
                    .descripcion(e.getDescripcion())
                    .participantes(e.getParticipantes())
                    .numParticipantes(e.getParticipantes() != null ? e.getParticipantes().size() : 0)
                    .fechaCreacion(e.getFechaCreacion())
                    .fechaActualizacion(e.getFechaActualizacion())
                    .build();
        }
    }
}
