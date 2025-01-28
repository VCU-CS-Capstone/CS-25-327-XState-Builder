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
          <option v-for="instance in instances" :key="instance" :value="instance">
            {{ instance }}
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
      definitions: ['1', '2', '3'],
      instances: ['1', '2', '3']
    };
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
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
</style>


