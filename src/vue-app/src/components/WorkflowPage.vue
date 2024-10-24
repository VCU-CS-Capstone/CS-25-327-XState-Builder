<template>
  <div>
    <h1>Workflow Page</h1>

    <div>
      <h2>Instance Information</h2>
      <p>{{ instanceInfo }}</p>
    </div>

    <div>
      <h2>Related Tasks</h2>
      <ul>
        <li v-for="task in tasks" :key="task.id" @click="selectTask(task)">
          {{ task.name }}
        </li>
      </ul>
    </div>

    <div v-if="selectedTask">
      <h2>Task Details</h2>
      <p>{{ selectedTask.details }}</p>
      <button @click="closeTask">Close Task</button>
      <button @click="createNewTask">Create New Task</button>
      <button @click="closeInstance">Close Instance</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      instanceInfo: 'Instance information goes here...',
      tasks: [
        { id: 1, name: 'Task 1', details: 'Details for Task 1' },
        { id: 2, name: 'Task 2', details: 'Details for Task 2' }
      ],
      selectedTask: null
    };
  },
  methods: {
    selectTask(task) {
      this.selectedTask = task;
    },
    closeTask() {
      // Logic for closing the task
      alert('Task Closed');
    },
    createNewTask() {
      // Logic for creating a new task
      alert('New Task Created');
    },
    closeInstance() {
      // Logic for closing the instance
      alert('Instance Closed');
    }
  }
};
</script>
