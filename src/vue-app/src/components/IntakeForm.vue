<template>
    <div>
      <!-- Header with logo and title -->
      <div class="banner d-flex justify-content-between align-items-center p-3">
        <h1 class="navy-blue">Workflow Intake Form</h1>
        <img
          src="../assets/Capital_One_logo.png"
          alt="Capital One Logo"
          class="logo"
        />
      </div>
  
      <!-- Form Section -->
      <div class="container mt-5">
        <form @submit.prevent="handleSubmit">
          <!-- Instance Details -->
          <div class="mb-3">
            <label for="instanceType" class="form-label">What is the instance type?</label>
            <input
              type="text"
              id="instanceType"
              class="form-control"
              v-model="formData.instanceType"
              placeholder="Enter instance type"
              required
            />
          </div>
          <div class="mb-3">
            <label for="instanceSubtype" class="form-label">What is the instance subtype?</label>
            <input
              type="text"
              id="instanceSubtype"
              class="form-control"
              v-model="formData.instanceSubtype"
              placeholder="Enter instance subtype"
              required
            />
          </div>
  
          <!-- Workflow States -->
          <div>
            <h3 class="mt-4">Define Your Workflow States</h3>
            <div v-for="(state, stateIndex) in formData.states" :key="stateIndex" class="border p-3 mb-3">
              <div class="mb-3">
                <label class="form-label">What is this state called? *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="state.name"
                  placeholder="Enter state name"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">What is the description of this state?</label>
                <textarea
                  class="form-control"
                  v-model="state.description"
                  placeholder="Enter state description"
                  required
                ></textarea>
              </div>
  
              <!-- Events for State -->
              <h4 class="mt-3">Define Events for This State</h4>
              <div v-for="(event, eventIndex) in state.events" :key="eventIndex" class="border p-3 mb-3">
                <div class="mb-3">
                  <label class="form-label">What event will your definition listen for in this state? *</label>
                  <select class="form-select" v-model="event.eventType" required>
                    <option value="" disabled>Select an event</option>
                    <option value="InstanceCreated">Instance Created</option>
                    <option value="InstanceClosed">Instance Closed</option>
                    <option value="CreateTask">Create Task</option>
                    <option value="TaskCreated">Task Created</option>
                    <option value="TaskClosed">Task Closed</option>
                    <option value="NoMore">No More</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">What action will need to be taken for this event? *</label>
                  <select class="form-select" v-model="event.action" required>
                    <option value="" disabled>Select an action</option>
                    <option value="CreateTask">Create Task</option>
                    <option value="CloseTask">Close Task</option>
                    <option value="CloseInstance">Close Instance</option>
                    <option value="Log">Log</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">What is the target state for this event? *</label>
                  <select class="form-select" v-model="event.targetState" required>
                    <option value="" disabled>Select a target state</option>
                    <option value="CreateTask">Create Task</option>
                    <option value="CloseTask">Close Task</option>
                    <option value="CloseInstance">Close Instance</option>
                    <option value="Closed">Closed</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <button type="button" class="btn btn-danger" @click="removeEvent(stateIndex, eventIndex)">
                  Remove Event
                </button>
              </div>
              <button type="button" class="btn btn-secondary" @click="addEvent(stateIndex)">
                Add Event
              </button>
            </div>
            <button type="button" class="btn btn-secondary mt-3" @click="addState">
              Add State
            </button>
          </div>
  
          <button type="submit" class="btn btn-primary w-100 mt-4">Submit</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "IntakeForm",
    data() {
      return {
        formData: {
          instanceType: "",
          instanceSubtype: "",
          states: [
            {
              name: "",
              description: "",
              events: [
                {
                  eventType: "",
                  action: "",
                  targetState: "",
                },
              ],
            },
          ],
        },
      };
    },
    methods: {
      addState() {
        this.formData.states.push({
          name: "",
          description: "",
          events: [
            {
              eventType: "",
              action: "",
              targetState: "",
            },
          ],
        });
      },
      removeState(index) {
        this.formData.states.splice(index, 1);
      },
      addEvent(stateIndex) {
        this.formData.states[stateIndex].events.push({
          eventType: "",
          action: "",
          targetState: "",
        });
      },
      removeEvent(stateIndex, eventIndex) {
        this.formData.states[stateIndex].events.splice(eventIndex, 1);
      },
      handleSubmit() {
        console.log("Form Submitted", this.formData);
        alert("Workflow intake form submitted successfully!");
        // Add backend integration or API call logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .banner {
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  .navy-blue {
    color: #003366;
  }
  .logo {
    height: 40px;
    width: auto;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  