<template>
  <div class="list-tasks">
    <div class="title has-text-centered">Listado de tareas</div>

    <form @submit.prevent="addTask" class="mb-5">
      <div class="field">
        <label for="" class="label">Nombre</label>
        <div class="control">
          <input type="text" class="input" placeholder="Ingrese nombre de la tarea" v-model="title"/>
        </div>
      </div>
      <div class="field">
        <label for="" class="label">Descripción</label>
        <div class="control">
          <input type="text" class="input" placeholder="Ingrese descripción de la tarea" v-model="description"/>
        </div>
      </div>
      <p class="control">
        <button :disabled="!title && !description" class="button is-info">
          Agregar
        </button>
      </p>
    </form>
    <form @submit.prevent="filterTasks">
      <div class="field mb-3">
        <label for="done">Seleccione una opción:</label>
      </div>
      <div class="field has-addons mb-5">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select v-model="selectedEstado">
              <option value="">Por favor seleccione una opción</option>
              <option value="0">Pendiente</option>
              <option value="1">Realizado</option>
            </select>
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button is-primary">Filtrar</button>
        </div>
      </div>
    </form>
    <div 
      v-for="(task, index) in tasks"
      class="card mb-5" :class="{'has-background-success-light' : task.done}" :key="index">
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div class="column" :class="{'has-text-success' : task.done}">
              <h4>{{ task.title }}</h4>
              <p :class="{'line-through': task.done}">{{ task.description }}</p>
            </div>
            <div class="column is-5 has-text-right">
              <button @click="toggleDone(task.id)" class="button" :class="task.done ? 'is-success' : 'is-light'">&check;</button>
              <button class="button is-danger ml-2" @click="deleteTask(task.id)">&cross;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

/*
imports
*/
import {Ref, ref, onMounted} from 'vue'
import { db } from '@/firebase'
import { 
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query, 
  orderBy,
  where,
  getDocs
} from "firebase/firestore"
import ITask from '@/interfaces/ITask';

/*
Firebase refs
*/
const tasksCollectionRef = collection(db, 'tasks')
const tasksCollectionQuery = query(tasksCollectionRef, orderBy("date", "desc"))

/* 
Tasks
*/
let tasks:Ref<Array<ITask>> = ref([])

/*
getTasks
*/
onMounted(() => {
  getAllTasks()
})

/*
Add Task
*/
const title = ref('')
const description = ref('')
const selectedEstado = ref('')

const addTask = async () => {
  await addDoc(tasksCollectionRef, {
    title: title.value,
    description: description.value,
    done: false,
    date: Date.now()
  });

  title.value = ''
  description.value = ''
}

/*
Delete Task
*/
const deleteTask = async (id: string) => {
  await deleteDoc(doc(tasksCollectionRef, id));
}

/*
Toggle Done
*/
const toggleDone = async (id: string) => {
  const index = tasks.value.findIndex(task => task.id === id)
  await updateDoc(doc(tasksCollectionRef, id), {
    done: !tasks.value[index].done
  })
}

/*
Filter tasks
*/
const filterTasks = async () => {
  let estado = false

  if (selectedEstado.value.length === 0) {
    getAllTasks()
  } else {
    if (parseInt(selectedEstado.value) === 1) estado = true
    let allTasks:ITask[] = []
    const q = query(tasksCollectionRef, where("done", "==", estado));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const task:ITask = {
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        done: doc.data().done
      }
      allTasks.push(task)
    });
    tasks.value = allTasks
  }
}

/*
Get tasks
*/
const getAllTasks = () => {
  onSnapshot(tasksCollectionQuery, (querySnapshot) => {
    let allTasks:ITask[] = []
    querySnapshot.forEach((doc) => {
      const task:ITask = {
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        done: doc.data().done
      }
      allTasks.push(task)
    });
    tasks.value = allTasks
  })
}
</script>

<style scoped>
@import 'bulma/css/bulma.min.css';

.list-tasks {
  max-width: 450px;
  padding: 20px;
  margin: 0 auto;
}

.line-through {
  text-decoration: line-through;
}
</style>