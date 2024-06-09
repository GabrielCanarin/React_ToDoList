import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { FAB } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';

import { router } from 'expo-router';

import { createTable } from '../../database/create';

import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('database.db');

export default function ListaToDo() {
  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    createTable();
    fetchTasksFromDatabase();
  }, []);


  const fetchTasksFromDatabase = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM tasks',
          [],
          (_, { rows }) => {
            const tasksFromDB = [];
            for (let i = 0; i < rows.length; i++) {
              tasksFromDB.push(rows.item(i));
            }
            setTasks(tasksFromDB);
          },
        );
      }
    );
  };

  function handleUpdate() {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newChecked = !task.checked;
        db.transaction(
          tx => {
            tx.executeSql(
              'UPDATE tasks SET checked = ? WHERE id = ?',
              [newChecked ? 1 : 0, id],
              () => console.log('Estado da tarefa atualizado com sucesso!'),
              (_, error) => console.log('Erro ao atualizar estado da tarefa:', error)
            );
          }
        );
        return { ...task, checked: newChecked };
      }
      return task;
    });
    setTasks(updatedTasks);
    setChecked(true)
  }

  function HandleClick() {
    router.navigate("/AddToDo");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={handleUpdate}
            />
            <Text style={styles.taskTitle}>{task.titulo}</Text>
            <Text style={styles.taskDescription}>{task.descricao}</Text>
          </View>
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={HandleClick}
      />
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTextContainer: {
    marginLeft: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 16,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 32,
    right: 0,
    bottom: 0,
  },
});
