package tensor.raiders.backend;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tensor.raiders.backend.model.Equipo;
import tensor.raiders.backend.repository.EquipoRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final EquipoRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.saveAll(List.of(
                Equipo.builder()
                    .nombre("Tensor Raiders Alpha")
                    .nivel(Equipo.Nivel.EXPERTO)
                    .descripcion("Equipo fundador especializado en IA y redes neuronales.")
                    .participantes(List.of("Ana García", "Carlos López", "Marta Ruiz"))
                    .build(),
                Equipo.builder()
                    .nombre("Beta Builders")
                    .nivel(Equipo.Nivel.AVANZADO)
                    .descripcion("Equipo de desarrollo full-stack con enfoque en microservicios.")
                    .participantes(List.of("Pedro Sánchez", "Laura Díaz"))
                    .build(),
                Equipo.builder()
                    .nombre("Gamma Squad")
                    .nivel(Equipo.Nivel.INTERMEDIO)
                    .descripcion("Equipo en formación con proyectos de ciencia de datos.")
                    .participantes(List.of("Juan Martín", "Sofía Torres", "Diego Herrera", "Elena Vega"))
                    .build(),
                Equipo.builder()
                    .nombre("Delta Devs")
                    .nivel(Equipo.Nivel.PRINCIPIANTE)
                    .descripcion("Nuevo equipo aprendiendo desarrollo web moderno.")
                    .participantes(List.of("Pablo Moreno", "Carmen Jiménez"))
                    .build()
            ));
            log.info("✅ Datos de ejemplo cargados correctamente.");
        }
    }
}
