import pkg from 'pg';
const { Pool } = pkg;

// Configura la conexión a tu base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',      
  database: 'ERP_Promart', 
  password: 'lopezmoreno', 
  port: 5432,             
});

// Prueba la conexión
pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL', err));

export default pool;
