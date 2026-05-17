const { Client } = require('pg');

async function main() {
  const remoteClient = new Client({ connectionString: 'postgresql://cdl_admin:2h4r3C@ntik@152.42.169.23:5432/cdl_production' });
  await remoteClient.connect();
  
  await remoteClient.query('DROP INDEX IF EXISTS "TestResult_userId_key"');
  console.log('Dropped invalid index on remote database.');
  
  await remoteClient.end();
}

main().catch(console.error);
