const { Client } = require('pg');

async function main() {
  const localClient = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/cdl_db' });
  const remoteClient = new Client({ connectionString: 'postgresql://cdl_admin:2h4r3C@ntik@152.42.169.23:5432/cdl_production' });

  await localClient.connect();
  await remoteClient.connect();

  console.log('Connected to both databases.');

  const localUser = await localClient.query("SELECT id, level FROM \"User\" WHERE email = 'guru1@mail.com'");
  const remoteUser = await remoteClient.query("SELECT id FROM \"User\" WHERE email = 'guru1@mail.com'");

  if (!localUser.rows.length) {
    console.error('User guru1@mail.com not found in LOCAL database.');
    return;
  }
  if (!remoteUser.rows.length) {
    console.error('User guru1@mail.com not found in REMOTE database.');
    return;
  }

  const localId = localUser.rows[0].id;
  const remoteId = remoteUser.rows[0].id;

  console.log(`Local ID: ${localId}, Remote ID: ${remoteId}`);

  // Cleanup existing data in remote for guru1
  await remoteClient.query("DELETE FROM \"Interaction\" WHERE \"userId\" = $1", [remoteId]);
  // TestAnswer will cascade delete? No, but deleting TestResult deletes TestAnswer because of onDelete: Cascade on foreign keys, wait, let's check schema.
  // schema: TestAnswer -> TestResult is RESTRICT or CASCADE?
  // Let's manually delete answers first.
  const remoteResults = await remoteClient.query("SELECT id FROM \"TestResult\" WHERE \"userId\" = $1", [remoteId]);
  for (const res of remoteResults.rows) {
    await remoteClient.query("DELETE FROM \"TestAnswer\" WHERE \"testResultId\" = $1", [res.id]);
  }
  await remoteClient.query("DELETE FROM \"TestResult\" WHERE \"userId\" = $1", [remoteId]);
  console.log('Cleaned up existing remote data for guru1.');

  // 1. Update user level
  if (localUser.rows[0].level) {
    await remoteClient.query("UPDATE \"User\" SET level = $1 WHERE id = $2", [localUser.rows[0].level, remoteId]);
    console.log(`Updated remote user level to ${localUser.rows[0].level}`);
  }

  // 2. Export Interactions
  const interactions = await localClient.query("SELECT * FROM \"Interaction\" WHERE \"userId\" = $1", [localId]);
  for (const row of interactions.rows) {
    await remoteClient.query(
      "INSERT INTO \"Interaction\" (id, \"userId\", \"userInput\", \"aiOutput\", \"createdAt\") VALUES ($1, $2, $3, $4, $5)",
      [row.id, remoteId, row.userInput, row.aiOutput, row.createdAt]
    );
  }
  console.log(`Migrated ${interactions.rows.length} interactions.`);

  // 3. Export TestResults
  const testResults = await localClient.query("SELECT * FROM \"TestResult\" WHERE \"userId\" = $1", [localId]);
  for (const row of testResults.rows) {
    await remoteClient.query(
      "INSERT INTO \"TestResult\" (id, \"userId\", type, score, level, \"completedAt\") VALUES ($1, $2, $3, $4, $5, $6)",
      [row.id, remoteId, row.type, row.score, row.level, row.completedAt]
    );
    
    // Export TestAnswers for this TestResult
    const answers = await localClient.query("SELECT * FROM \"TestAnswer\" WHERE \"testResultId\" = $1", [row.id]);
    for (const ans of answers.rows) {
      await remoteClient.query(
        "INSERT INTO \"TestAnswer\" (id, \"testResultId\", \"questionId\", \"selectedAnswer\", \"isCorrect\", \"confidenceScore\", \"createdAt\") VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [ans.id, row.id, ans.questionId, ans.selectedAnswer, ans.isCorrect, ans.confidenceScore, ans.createdAt]
      );
    }
    console.log(`Migrated test result ${row.type} with ${answers.rows.length} answers.`);
  }

  console.log('Migration complete!');
  await localClient.end();
  await remoteClient.end();
}

main().catch(console.error);
