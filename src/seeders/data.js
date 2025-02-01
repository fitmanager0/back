const { v4: uuidv4 } = require('uuid');

// Datos iniciales para el seeder
const data = {
  roles: [
    { id_role: 1, description: "administrador" },
    { id_role: 2, description: "entrenador" },
    { id_role: 3, description: "socio" },
  ],
  levels: [
    { id_level: 1, description: "Inicial" },
    { id_level: 2, description: "Intermedio" },
    { id_level: 3, description: "Avanzado" },
  ],
  users: [
    // Administrador
    {
      id_user: uuidv4(),
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed-password",
      id_rol: 1,
      phone: "+1234567890",
      entry_date: new Date().toISOString(),
      isActive: true, // Siempre activo
    },
    // Entrenadores
    {
      id_user: uuidv4(),
      name: "Trainer One",
      email: "trainer1@example.com",
      password: "hashed-password",
      id_rol: 2,
      phone: "+1987654321",
      entry_date: new Date().toISOString(),
      isActive: true, // Siempre activo
    },
    {
      id_user: uuidv4(),
      name: "Trainer Two",
      email: "trainer2@example.com",
      password: "hashed-password",
      id_rol: 2,
      phone: "+1123456789",
      entry_date: new Date().toISOString(),
      isActive: true, // Siempre activo
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
        password: "hashed-password",
        id_rol: 3, // Rol de socio
        phone: `+12345678${i + 10}`, // Generar números de teléfono como strings
        entry_date: date.toISOString(),
        isActive: i % 2 === 0, // Alternar entre activo/inactivo
      };
    }),
  ],
};

module.exports = data;
