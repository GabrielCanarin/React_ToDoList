import React, { useState } from "react";
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('database.db');

export default function ListaToDo() {
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");

  const insertData = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO tasks (titulo, descricao) VALUES (?, ?)',
          [title, descricao],
          (_, result) => {
            console.log('Dados inseridos com sucesso!');
          },
        );
      }
    );
  };

  const handleClick = () => {
    insertData();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textarea}>
        <TextInput
          style={styles.label}
          label="Título"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
        />
        <TextInput
          style={styles.label}
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          mode="outlined"
        />
      </View>
      <Button style={styles.button} mode="contained" onPress={handleClick}>
        Criar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {
    width: '90%',
    marginTop: 48,
  },
  label: {
    width: '100%',
    marginTop: 16,
  },
  button: {
    width: '90%',
    marginTop: 32,
    padding: 4,
  },
});
