package tensor.raiders.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tensor.raiders.backend.exception.EquipoNotFoundException;
import tensor.raiders.backend.exception.NombreDuplicadoException;
import tensor.raiders.backend.model.Equipo;
import tensor.raiders.backend.model.EquipoDTO;
import tensor.raiders.backend.repository.EquipoRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipoService {

    private final EquipoRepository repository;

    // ── Crear ─────────────────────────────────────────────────────────────────
    public EquipoDTO.Response crear(EquipoDTO.Request dto) {
        if (repository.existsByNombreIgnoreCase(dto.getNombre())) {
            throw new NombreDuplicadoException("Ya existe un equipo con el nombre: " + dto.getNombre());
        }
        Equipo equipo = Equipo.builder()
                .nombre(dto.getNombre())
                .nivel(dto.getNivel())
                .descripcion(dto.getDescripcion())
                .participantes(dto.getParticipantes())
                .build();
        return EquipoDTO.Response.fromEntity(repository.save(equipo));
    }

    // ── Obtener por ID ────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public EquipoDTO.Response obtenerPorId(Long id) {
        return EquipoDTO.Response.fromEntity(findOrThrow(id));
    }

    // ── Listar todos ──────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<EquipoDTO.Response> listarTodos() {
        return repository.findAll().stream()
                .map(EquipoDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Buscar por nivel ──────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<EquipoDTO.Response> buscarPorNivel(Equipo.Nivel nivel) {
        return repository.findByNivel(nivel).stream()
                .map(EquipoDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Buscar por keyword ────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<EquipoDTO.Response> buscar(String keyword) {
        return repository.buscarPorKeyword(keyword).stream()
                .map(EquipoDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Actualizar ────────────────────────────────────────────────────────────
    public EquipoDTO.Response actualizar(Long id, EquipoDTO.Request dto) {
        Equipo equipo = findOrThrow(id);
        if (!equipo.getNombre().equalsIgnoreCase(dto.getNombre())
                && repository.existsByNombreIgnoreCase(dto.getNombre())) {
            throw new NombreDuplicadoException("Ya existe un equipo con el nombre: " + dto.getNombre());
        }
        equipo.setNombre(dto.getNombre());
        equipo.setNivel(dto.getNivel());
        equipo.setDescripcion(dto.getDescripcion());
        equipo.setParticipantes(dto.getParticipantes());
        return EquipoDTO.Response.fromEntity(repository.save(equipo));
    }

    // ── Eliminar ──────────────────────────────────────────────────────────────
    public void eliminar(Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    // ── Estadísticas ──────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Map<String, Object> estadisticas() {
        long total = repository.count();
        Map<String, Long> porNivel = java.util.Arrays.stream(Equipo.Nivel.values())
                .collect(Collectors.toMap(Enum::name, repository::contarPorNivel));
        return Map.of("totalEquipos", total, "porNivel", porNivel);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private Equipo findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EquipoNotFoundException("Equipo no encontrado con id: " + id));
    }
}
