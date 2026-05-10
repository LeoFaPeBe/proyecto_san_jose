import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  // Usuario admin
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sanjosetatacoa.com' },
    update: {},
    create: { email: 'admin@sanjosetatacoa.com', passwordHash: hash, nombre: 'Administrador', rol: 'ADMIN' },
  });

  // Alojamientos
  const alojamientos = [
    { nombre: 'Cabaña El Cactus', icon: '🏡', capacidad: '2–4 personas', precio: 180000, descripcion: 'Cabaña rústica con cama doble, baño privado y vista panorámica al desierto.', disponible: true },
    { nombre: 'Glamping Estrella del Desierto', icon: '⛺', capacidad: '2 personas', precio: 220000, descripcion: 'Cúpula geodésica con ventanas al cielo para observar las estrellas.', disponible: true },
    { nombre: 'Habitación Familiar', icon: '🛏️', capacidad: '4–6 personas', precio: 250000, descripcion: 'Amplia habitación con 3 camas, baño compartido y zona de descanso.', disponible: true },
    { nombre: 'Habitación Doble', icon: '🛏️', capacidad: '2 personas', precio: 120000, descripcion: 'Habitación cómoda con cama doble y baño compartido.', disponible: true },
    { nombre: 'Camping Bajo las Estrellas', icon: '🌌', capacidad: '1–3 personas', precio: 45000, descripcion: 'Área de camping con zona de fogón, baños comunales y desayuno.', disponible: true },
    { nombre: 'Cúpula Astronómica', icon: '🔭', capacidad: '2 personas', precio: 280000, descripcion: 'Cúpula premium con telescopio y guía astronómica privada.', disponible: false },
  ];
  for (const a of alojamientos) {
    await prisma.alojamiento.upsert({ where: { id: a.nombre }, update: {}, create: { id: a.nombre, ...a } });
  }

  // Actividades
  const actividades = [
    { nombre: 'Observación de estrellas', icon: '🔭', duracion: '2 horas', precio: 35000, descripcion: 'Noche astronómica con guía experto en el cielo sin contaminación lumínica.' },
    { nombre: 'Cabalgata por el desierto', icon: '🐴', duracion: '1.5 horas', precio: 40000, descripcion: 'Recorre el desierto a caballo con guías locales expertos.' },
    { nombre: 'Caminata guiada', icon: '🥾', duracion: '3 horas', precio: 30000, descripcion: 'Explora la flora, fauna y secretos geológicos del desierto.' },
    { nombre: 'Ordeño de vacas', icon: '🐄', duracion: '45 min', precio: 20000, descripcion: 'Aprende las tradiciones agrícolas de la región al amanecer.' },
    { nombre: 'Tour Desierto Rojo', icon: '🌵', duracion: '4 horas', precio: 55000, descripcion: 'Visita las formaciones rojizas del sector más fotogénico.' },
    { nombre: 'Tour Desierto Gris', icon: '🌵', duracion: '4 horas', precio: 55000, descripcion: 'Explora el sector gris, hogar de fósiles prehistóricos.' },
    { nombre: 'Piscina y relax', icon: '🏊', duracion: 'Libre', precio: 15000, descripcion: 'Refresca tu cuerpo en nuestra piscina al aire libre.' },
    { nombre: 'Restaurante típico', icon: '🍽️', duracion: 'Servicio diario', precio: 25000, descripcion: 'Comida tradicional huilense con ingredientes frescos.' },
  ];
  for (const a of actividades) {
    await prisma.actividad.upsert({ where: { id: a.nombre }, update: {}, create: { id: a.nombre, ...a } });
  }

  // Reservas de ejemplo
  const admin = await prisma.user.findFirst();
  const samples = [
    { codigo: 'R-001', huesped: 'Rubiela Castro', email: 'rubiela@gmail.com', telefono: '+57 301 234 5678', alojamiento: 'Cabaña El Cactus', llegada: new Date('2026-05-10'), salida: new Date('2026-05-12'), personas: 3, actividades: JSON.stringify(['Cabalgata por el desierto']), notas: 'Aniversario', estado: 'Confirmada', total: '$360.000' },
    { codigo: 'R-002', huesped: 'Angela Rojas', email: 'arojas@outlook.com', telefono: '+57 312 876 5432', alojamiento: 'Glamping Estrella del Desierto', llegada: new Date('2026-05-15'), salida: new Date('2026-05-17'), personas: 2, actividades: JSON.stringify(['Observación de estrellas', 'Tour Desierto Rojo']), notas: '', estado: 'Pendiente', total: '$440.000' },
    { codigo: 'R-003', huesped: 'Santiago Vargas', email: 'svargas@hotmail.com', telefono: '+57 315 000 1111', alojamiento: 'Habitación Familiar', llegada: new Date('2026-05-20'), salida: new Date('2026-05-23'), personas: 5, actividades: JSON.stringify(['Caminata guiada']), notas: 'Viajan con niños', estado: 'Confirmada', total: '$750.000' },
  ];
  for (const r of samples) {
    await prisma.reserva.upsert({ where: { codigo: r.codigo }, update: {}, create: { ...r, creadoPor: admin?.id } });
  }

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });