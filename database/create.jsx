import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('database.db');

const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                descricao TEXT,
                checked INTEGER DEFAULT 0
      );`,
      [],
      (_, result) => {
        console.log('Tabela de usuários criada com sucesso!');
      },
    );
  },
    error => console.log('Erro ao iniciar transação:', error));
};

export { createTable };