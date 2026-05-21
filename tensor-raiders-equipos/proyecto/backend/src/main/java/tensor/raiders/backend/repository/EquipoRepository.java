package tensor.raiders.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tensor.raiders.backend.model.Equipo;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    Optional<Equipo> findByNombreIgnoreCase(String nombre);

    List<Equipo> findByNivel(Equipo.Nivel nivel);

    @Query("SELECT e FROM Equipo e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.descripcion) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Equipo> buscarPorKeyword(@Param("keyword") String keyword);

    boolean existsByNombreIgnoreCase(String nombre);

    @Query("SELECT COUNT(e) FROM Equipo e WHERE e.nivel = :nivel")
    long contarPorNivel(@Param("nivel") Equipo.Nivel nivel);
}
