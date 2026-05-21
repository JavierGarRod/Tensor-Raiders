create database Equipos;
use Equipos;
create table equipo (
id_equipo int primary key,
nombre varchar(100),
categoria varchar(100)
);
create table jugador (
id_jugador int primary key,
nombre varchar(100),
apellido varchar(100),
dorsal int,
posicion varchar(100),
equipo int, 
foreign key (equipo) references equipo(id_equipo)
);
insert into equipo values
(1, 'Real Madrid', 'sub-18'),
(2, 'FC Barcelona', 'senior'),
(3, 'Sevilla', 'juvenil');
insert into jugador values 
(1, 'Manuel', 'Perez', 1, 'Portero', 1),
(2, 'Julio', 'Gonzalez', 6, 'Delantero', 1),
(3, 'Mario', 'Garcia', 11, 'Centrocampista', 2),
(4, 'Gabriel', 'Marquez', 10, 'Defensa', 3),
(5, 'Adrian', 'Hernandez', 1, 'Portero', 3);