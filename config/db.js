import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('DATABASE_URL:');
console.log(process.env.DATABASE_URL);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(
      '!===== Gagal terkoneksi ke database PostgreSQL: =====!\n',
      err.stack,
    );
  } else {
    console.log('#===== Koneksi database PostgreSQL Berhasil Berjalan! =====#');
  }
});

export default pool;
