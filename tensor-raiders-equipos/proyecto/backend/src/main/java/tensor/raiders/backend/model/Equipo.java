package tensor.raiders.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del equipo es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, unique = true)
    private String nombre;

    @NotNull(message = "El nivel es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nivel nivel;

    @Size(max = 300, message = "La descripción no puede superar 300 caracteres")
    private String descripcion;

    @ElementCollection
    @CollectionTable(name = "participantes", joinColumns = @JoinColumn(name = "equipo_id"))
    @Column(name = "nombre_participante")
    private List<String> participantes;

    @Column(updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    public enum Nivel {
        PRINCIPIANTE, INTERMEDIO, AVANZADO, EXPERTO
    }
}
