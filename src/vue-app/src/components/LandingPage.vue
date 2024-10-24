<template>
  <div>
    <h1>Landing Page</h1>
    <button @click="selectOption('new')">Create New Instance</button>
    <button @click="selectOption('review')">Review Open Instance</button>

    <div v-if="selectedOption === 'new'">
      <select v-model="selectedDefinition">
        <option disabled value="">Please select a definition</option>
        <option v-for="definition in definitions" :key="definition" :value="definition">
          {{ definition }}
        </option>
      </select>
    </div>

    <div v-if="selectedOption === 'review'">
      <select v-model="selectedInstance">
        <option disabled value="">Please select an instance ID</option>
        <option v-for="instance in instances" :key="instance" :value="instance">
          {{ instance }}
        </option>
      </select>
    </div>

    <button @click="handleSubmit">Submit</button>
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
      instances: ['Instance 1', 'Instance 2', 'Instance 3']
    };
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
    },
    handleSubmit() {
      if (this.selectedOption === 'new' && this.selectedDefinition) {
        this.$router.push({ name: 'workflow', params: { definition: this.selectedDefinition } });
      } else if (this.selectedOption === 'review' && this.selectedInstance) {
        this.$router.push({ name: 'workflow', params: { instance: this.selectedInstance } });
      }
    }
  }
};
</script>
