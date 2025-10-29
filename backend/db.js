import pkg from 'pg';
const { Pool } = pkg;

// Configura la conexión a tu base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',       // Tu usuario de PostgreSQL
  host: 'localhost',      // Servidor local
  database: 'ERP_Promart', // Nombre de tu base de datos
  password: 'lopezmoreno', // Tu contraseña de PostgreSQL
  port: 5432,             // Puerto por defecto de PostgreSQL
});

// Prueba la conexión
pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL', err));

export default pool;
