package tensor.raiders.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tensor.raiders.backend.model.Equipo;
import tensor.raiders.backend.model.EquipoDTO;
import tensor.raiders.backend.service.EquipoService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService service;

    /** POST /api/equipos — Registrar equipo */
    @PostMapping
    public ResponseEntity<EquipoDTO.Response> crear(@Valid @RequestBody EquipoDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    /** GET /api/equipos — Listar todos */
    @GetMapping
    public ResponseEntity<List<EquipoDTO.Response>> listar(
            @RequestParam(required = false) String buscar,
            @RequestParam(required = false) Equipo.Nivel nivel) {

        if (buscar != null && !buscar.isBlank()) {
            return ResponseEntity.ok(service.buscar(buscar));
        }
        if (nivel != null) {
            return ResponseEntity.ok(service.buscarPorNivel(nivel));
        }
        return ResponseEntity.ok(service.listarTodos());
    }

    /** GET /api/equipos/{id} — Consultar por ID */
    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO.Response> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    /** PUT /api/equipos/{id} — Actualizar equipo */
    @PutMapping("/{id}")
    public ResponseEntity<EquipoDTO.Response> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody EquipoDTO.Request dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    /** DELETE /api/equipos/{id} — Eliminar equipo */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/equipos/estadisticas — Estadísticas */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> estadisticas() {
        return ResponseEntity.ok(service.estadisticas());
    }
}
