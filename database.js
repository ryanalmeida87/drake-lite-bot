// Banco de dados simples com lowdb (JSON)
const { Low, JSONFile } = require('lowdb');
const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
fs.ensureFileSync(dbPath);

const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || {
    users: {},
    groups: {},
    economy: {}
  };
  await db.write();
}

function getUser(id) {
  return db.data.users[id] || (db.data.users[id] = { id, balance: 0, xp: 0, level: 1, lastWork: 0 });
}

function updateUser(id, data) {
  db.data.users[id] = { ...getUser(id), ...data };
  db.write();
}

module.exports = { initDB, getUser, updateUser, db };