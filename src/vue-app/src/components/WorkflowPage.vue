<template>
  <div>
    <div class="banner d-flex justify-content-between align-items-center p-3">
      <h1 class="navy-blue">Workflow Page</h1>
      <img src="../assets/Capital_One_logo.png" alt="Capital One Logo" class="logo">
    </div>
    <div class="container mt-5 pt-5">
      <div class="my-4">
        <h2>Instance Information</h2>
        <p>{{ instanceInfo }}</p>
      </div>

      <div class="my-4">
        <h2>Related Tasks</h2>
        <ul class="list-group">
          <li class="list-group-item" v-for="task in tasks" :key="task.id" @click="selectTask(task)">
            {{ task.name }}
          </li>
        </ul>
      </div>

      <div v-if="selectedTask" class="my-4">
        <h2>Task Details</h2>
        <p>{{ selectedTask.details }}</p>
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-danger" @click="closeTask">Close Task</button>
          <button class="btn btn-primary" @click="createNewTask">Create New Task</button>
          <button class="btn btn-warning" @click="closeInstance">Close Instance</button>
        </div>
      </div>
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

<style>
.banner {
  background-color: white; /* White background color */
  position: fixed; /* Fix the position at the top */
  top: 0;
  width: 100%;
  z-index: 1000; /* Ensure it stays on top of other elements */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow for better visual separation */
}

.container {
  margin-top: 100px; /* Adjust to account for the fixed banner height */
  padding-top: 50px; /* Additional padding to ensure no content is cut off */
}

.navy-blue {
  color: #004080; /* Capital One's navy blue */
}

.logo {
  height: 40px;
}

.my-4 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.mt-5 {
  margin-top: 3rem;
}

.pt-5 {
  padding-top: 3rem;
}
</style>
