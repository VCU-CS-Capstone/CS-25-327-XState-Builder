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
          <li class="list-group-item" v-for="task in tasks" :key="task.taskid" @click="selectTask(task)">
            {{ task.name }}
          </li>
        </ul>
      </div>

      <div v-if="selectedTask" class="my-4">
        <h2>Task Details</h2>
        <p>Instance ID: {{ selectedTask.instanceid }}</p>
        <p>Task ID: {{ selectedTask.taskid }}</p>
        <p>Notes: {{ selectedTask.notes }}</p>
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
  props: ['instanceid'],
  data() {
    return {
      instanceInfo: '',
      tasks: [], // Initialized empty list for tasks
      selectedTask: null // Initialize selected task
    };
  },
  methods: {
    async fetchTasks() {
      if(!this.instanceid) {
        console.warn('No instance ID provided');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/tasks?instanceid=${this.instanceid}`);
        const data = await response.json();
        console.log('Data:', data);
        this.tasks = data;
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    },
    selectTask(task) {
      this.selectedTask = task;
    },
    closeTask() {
      this.selectedTask = null;
      //alert('Task Closed');
    },
    createNewTask() {
      // Logic for creating a new task
      alert('To be implemented');
    },
    closeInstance() {
      this.$router.push({ name: 'landing' });
      //alert('Instance Closed');
    }
  },
  mounted() {
    console.log('Component mounted.');
    this.fetchTasks();  // continue fetching real data
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
