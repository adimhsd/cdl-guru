const { Client } = require('pg');

async function main() {
  const remoteClient = new Client({ connectionString: 'postgresql://cdl_admin:2h4r3C@ntik@152.42.169.23:5432/cdl_production' });
  await remoteClient.connect();
  
  await remoteClient.query("UPDATE \"User\" SET name = 'Adi Muhamad Muhsidi' WHERE email = 'guru1@mail.com'");
  console.log('Successfully updated guru1 name to Adi Muhamad Muhsidi');
  
  await remoteClient.end();
}

main().catch(console.error);
