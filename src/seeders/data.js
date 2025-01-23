const { v4: uuidv4 } = require('uuid');

// Datos iniciales para el seeder
const data = {
  roles: [
    { id_role: 1, description: "administrador" },
    { id_role: 2, description: "entrenador" },
    { id_role: 3, description: "socio" },
  ],
  levels: [
    { id_level: uuidv4(), description: "Inicial" },
    { id_level: uuidv4(), description: "Intermedio" },
    { id_level: uuidv4(), description: "Avanzado" },
  ],
  users: [
    // Administrador
    {
      id_user: uuidv4(),
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed-password",  // Recuerda cifrar la contraseña
      roleId: 1,  // Asigna el id_role correspondiente
      createdAt: new Date().toISOString(),
    },
    // Entrenadores
    {
      id_user: uuidv4(),
      name: "Trainer One",
      email: "trainer1@example.com",
      password: "hashed-password",  // Recuerda cifrar la contraseña
      roleId: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id_user: uuidv4(),
      name: "Trainer Two",
      email: "trainer2@example.com",
      password: "hashed-password",  // Recuerda cifrar la contraseña
      roleId: 2,
      createdAt: new Date().toISOString(),
    },
    // Socios
    ...Array.from({ length: 50 }, (_, i) => {
      const id_user = uuidv4();
      const date = new Date();
      date.setDate(Math.floor(Math.random() * (date.getDate() - 1)) + 1);  // Fecha aleatoria
      return {
        id_user,
        name: `Socio ${i + 1}`,
        email: `socio${i + 1}@example.com`,
        password: "hashed-password",  // Recuerda cifrar la contraseña
        roleId: 3,  // Rol de socio
        createdAt: date.toISOString(),
      };
    }),
  ],
  payments: [
    ...Array.from({ length: 50 }, (_, i) => {
      const id_user = uuidv4();  // UUID generado para el usuario
      const startDate = new Date(new Date().setDate(Math.floor(Math.random() * (new Date().getDate() - 1)) + 1));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 30);  // Duración del pago
      return {
        id_payment: uuidv4(),  // UUID generado para el pago
        userId: id_user,
        amount: 1000,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    }),
  ],
  routines: [
    ...Array.from({ length: 50 }, (_, i) => {
      const id_user = uuidv4();  // UUID generado para el usuario
      const id_level = Math.floor(Math.random() * 3) + 1;  // Nivel aleatorio
      return {
        id_routine: uuidv4(),  // UUID generado para la rutina
        userId: id_user,
        levelId: id_level,  // Asignación aleatoria de nivel
        routineUrl: `https://cloudinary.com/routine-${i + 1}.pdf`,  // URL aleatoria
      };
    }),
  ],
  healthSheets: [
    ...Array.from({ length: 50 }, (_, i) => {
      const id_user = uuidv4();  // UUID generado para el usuario
      return {
        id_sheet: uuidv4(),  // UUID generado para la hoja de salud
        userId: id_user,
        observations: "Sin observaciones",  // Observación predeterminada
      };
    }),
  ],
};

module.exports = data;
