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
      password: "hashed-password", // Recuerda cifrar la contraseña
      id_rol: 1, // Asigna el id_role correspondiente
      entry_date: new Date().toISOString(),
    },
    // Entrenadores
    {
      id_user: uuidv4(),
      name: "Trainer One",
      email: "trainer1@example.com",
      password: "hashed-password", // Recuerda cifrar la contraseña
      id_rol: 2,
      entry_date: new Date().toISOString(),
    },
    {
      id_user: uuidv4(),
      name: "Trainer Two",
      email: "trainer2@example.com",
      password: "hashed-password", // Recuerda cifrar la contraseña
      id_rol: 2,
      entry_date: new Date().toISOString(),
    },
    // Socios
    ...Array.from({ length: 50 }, (_, i) => {
      const id_user = uuidv4();
      const date = new Date();
      date.setDate(Math.floor(Math.random() * 28) + 1); // Fecha aleatoria del mes actual
      return {
        id_user,
        name: `Socio ${i + 1}`,
        email: `socio${i + 1}@example.com`,
        password: "hashed-password", // Recuerda cifrar la contraseña
        id_rol: 3, // Rol de socio
        entry_date: date.toISOString(),
      };
    }),
  ],
};

module.exports = data;
