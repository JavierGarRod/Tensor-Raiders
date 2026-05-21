-- ============================================================
--  Script SQL - Datos de ejemplo para Tensor Raiders Equipos
--  Base de datos: H2 (en memoria) — se ejecuta al arrancar
--  La tabla se crea automáticamente por Hibernate (ddl-auto=create-drop)
--  Este fichero es solo referencia / para importar en otro SGBD
-- ============================================================

-- Limpiar datos previos (en H2 se usa TRUNCATE o DELETE)
DELETE FROM participantes;
DELETE FROM equipos;

-- ── Equipos ────────────────────────────────────────────────────────────────────
INSERT INTO equipos (id, nombre, nivel, descripcion, fecha_creacion, fecha_actualizacion) VALUES
(1, 'Tensor Raiders Alpha',  'EXPERTO',       'Equipo fundador especializado en IA y redes neuronales.',               NOW(), NOW()),
(2, 'Beta Builders',          'AVANZADO',      'Equipo de desarrollo full-stack con enfoque en microservicios.',         NOW(), NOW()),
(3, 'Gamma Squad',            'INTERMEDIO',    'Equipo en formación con proyectos de ciencia de datos.',                 NOW(), NOW()),
(4, 'Delta Devs',             'PRINCIPIANTE',  'Nuevo equipo aprendiendo desarrollo web moderno con Spring + Angular.',  NOW(), NOW()),
(5, 'Epsilon Force',          'AVANZADO',      'Especialistas en seguridad y pentesting.',                               NOW(), NOW()),
(6, 'Zeta Pioneers',          'EXPERTO',       'Investigación en computación cuántica y criptografía.',                  NOW(), NOW());

-- ── Participantes ──────────────────────────────────────────────────────────────
-- Equipo 1: Tensor Raiders Alpha
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(1, 'Ana García'), (1, 'Carlos López'), (1, 'Marta Ruiz');

-- Equipo 2: Beta Builders
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(2, 'Pedro Sánchez'), (2, 'Laura Díaz'), (2, 'Miguel Torres');

-- Equipo 3: Gamma Squad
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(3, 'Juan Martín'), (3, 'Sofía Torres'), (3, 'Diego Herrera'), (3, 'Elena Vega');

-- Equipo 4: Delta Devs
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(4, 'Pablo Moreno'), (4, 'Carmen Jiménez');

-- Equipo 5: Epsilon Force
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(5, 'Roberto Silva'), (5, 'Natalia Fernández'), (5, 'Andrés Castro');

-- Equipo 6: Zeta Pioneers
INSERT INTO participantes (equipo_id, nombre_participante) VALUES
(6, 'Isabel Ramírez'), (6, 'Francisco Molina'), (6, 'Teresa Navarro'), (6, 'Álvaro Ortega');

-- ── Verificación ───────────────────────────────────────────────────────────────
-- SELECT e.nombre, e.nivel, COUNT(p.nombre_participante) as num_participantes
-- FROM equipos e
-- LEFT JOIN participantes p ON p.equipo_id = e.id
-- GROUP BY e.id, e.nombre, e.nivel
-- ORDER BY e.nivel;
