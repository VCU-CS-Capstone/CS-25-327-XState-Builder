<template>
  <div>
    <div class="banner d-flex justify-content-between align-items-center p-3">
      <h1 class="navy-blue">Landing Page</h1>
      <img src="../assets/Capital_One_logo.png" alt="Capital One Logo" class="logo">
    </div>
    <div class="container mt-5 pt-5">
      <h2>Create or Review an Instance</h2>
      <div class="d-flex justify-content-center my-4">
        <button class="btn btn-primary mx-2" @click="selectOption('new')">Create New Instance</button>
        <button class="btn btn-secondary mx-2" @click="selectOption('review')">Review Open Instance</button>
      </div>

      <div v-if="selectedOption === 'new'" class="form-group">
        <label for="definitionSelect">Select a Definition:</label>
        <select id="definitionSelect" v-model="selectedDefinition" class="form-control">
          <option disabled value="">Please select a definition</option>
          <option v-for="definition in definitions" :key="definition" :value="definition">
            {{ definition }}
          </option>
        </select>
      </div>

      <div v-if="selectedOption === 'review'" class="form-group mt-3">
        <label for="instanceSelect">Select an Instance ID:</label>
        <select id="instanceSelect" v-model="selectedInstance" class="form-control">
          <option disabled value="">Please select an instance ID</option>
          <option v-for="instance in instances" :key="instance.instanceid" :value="instance.instanceid">
            {{ instance.name }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button class="btn btn-success" @click="handleSubmit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: '',
      selectedDefinition: '',
      selectedInstance: '',
      definitions: ['Definition 1', 'Definition 2', 'Definition 3'],
      instances: [] // List of instances fetched from the database
    };
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
    },
    async fetchInstances() {
      try {
        const response = await fetch('http://localhost:4000/instances');
        const data = await response.json();
        this.instances = data;
      } catch (error) {
        console.error('Error fetching instances', error);
      }
    },
    handleSubmit() {
      if (this.selectedOption === 'new' && this.selectedDefinition) {
        this.$router.push({ name: 'workflow', params: { instanceid: this.selectedDefinition } });
      } else if (this.selectedOption === 'review' && this.selectedInstance) {
        this.$router.push({ name: 'workflow', params: { instanceid: this.selectedInstance } });
      } else {
        alert('Please select an option and an appropriate value.');
      }
    }
  },
  mounted() {
    this.fetchInstances(); // Fetch instances when the component is mounted
  }
};
</script>

<style>
.banner {
  background-color: white; 
  position: fixed; 
  top: 0;
  width: 100%;
  z-index: 1000; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.container {
  margin-top: 100px;
  padding-top: 50px; 
}

.navy-blue {
  color: #004080; 
}

.logo {
  height: 40px;
}
</style>
