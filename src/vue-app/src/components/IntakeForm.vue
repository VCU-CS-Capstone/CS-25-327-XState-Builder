<template>
  <div>
    <!-- Fixed Banner -->
    <div class="banner d-flex justify-content-between align-items-center">
      <h1 class="navy-blue">Workflow Intake Form</h1>
      <img src="../assets/Capital_One_logo.png" alt="Capital One Logo" class="logo" />
    </div>

    <!-- Container -->
    <div class="container-fluid px-5">
      <!-- Content Wrapper to push content below banner -->
      <div class="content-wrapper">
        <!-- Pop-up message displayed on form submission -->
        <div v-if="formSubmitted" class="alert alert-success text-center">
          The form has been completed! Redirecting to the workflow page...
        </div>

        <form @submit.prevent="handleSubmit" v-show="!formSubmitted">
          <div class="row gx-5">
            <!-- Left Column: Instance Details -->
            <div class="col-md-4 border-end pe-4">
              <h4 class="mb-3">Instance Details</h4>
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
            </div>

            <!-- Right Column: Workflow States & Events -->
            <div class="col-md-8 ps-4">
              <h4 class="mb-3">Define Your Workflow States</h4>
              <div
                v-for="(state, stateIndex) in formData.states"
                :key="stateIndex"
                class="card mb-4"
              >
                <!-- Card Header -->
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                  <span>State {{ stateIndex + 1 }}</span>
                  <button type="button" class="btn btn-danger btn-sm" @click="removeState(stateIndex)">
                    Remove State
                  </button>
                </div>
                <div class="card-body">
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

                  <!-- Events Section -->
                  <h6 class="mb-3">Define Events for This State</h6>
                  <div
                    v-for="(event, eventIndex) in state.events"
                    :key="eventIndex"
                    class="border p-3 mb-3"
                  >
                    <div class="row g-2">
                      <div class="col-md-4">
                        <label class="form-label">Event</label>
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
                      <div class="col-md-4">
                        <label class="form-label">Action</label>
                        <select class="form-select" v-model="event.action" required>
                          <option value="" disabled>Select an action</option>
                          <option value="CreateTask">Create Task</option>
                          <option value="CloseTask">Close Task</option>
                          <option value="CloseInstance">Close Instance</option>
                          <option value="Log">Log</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Target State</label>
                        <select class="form-select" v-model="event.targetState" required>
                          <option value="" disabled>Select a target state</option>
                          <option value="CreateTask">Create Task</option>
                          <option value="CloseTask">Close Task</option>
                          <option value="CloseInstance">Close Instance</option>
                          <option value="Closed">Closed</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                    </div>
                    <!-- Remove Event Button with "-" -->
                    <div class="d-flex justify-content-end mt-2">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="removeEvent(stateIndex, eventIndex)"
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <!-- Add Event Button with "+" -->
                  <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary btn-sm" @click="addEvent(stateIndex)">
                      +
                    </button>
                  </div>
                </div>
              </div>
              <!-- Add State Button Right-Aligned -->
              <div class="d-flex justify-content-end mb-4">
                <button type="button" class="btn btn-secondary" @click="addState">
                  Add State
                </button>
              </div>

              <!-- Submit Button Centered Under "Action" Column -->
              <div class="row mb-4">
                <div class="col-md-4"></div>
                <div class="col-md-4 d-flex justify-content-center">
                  <button type="submit" class="btn btn-primary w-75">Submit</button>
                </div>
                <div class="col-md-4"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
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
      formSubmitted: false, // Flag to indicate form submission
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
    async handleSubmit() {
    // Create the JSON structure
    const jsonData = {
      instanceDetails: {
        instanceType: this.formData.instanceType,
        instanceSubtype: this.formData.instanceSubtype,
      },
      workflowStates: this.formData.states.map((state) => ({
        name: state.name,
        description: state.description,
        events: state.events.map((event) => ({
          eventType: event.eventType,
          action: event.action,
          targetState: event.targetState,
        })),
      })),
    };

    try {
      // post request to the create-pr endpoint
      const response = await fetch('http://localhost:4000/api/create-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ machineDefinition: jsonData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('PR created successfully:', result.prUrl); // Log the Pull Request URL
        this.formSubmitted = true; // Update form state
      } else {
        const errorData = await response.json();
        console.error('Error creating PR:', errorData.error); // Log the error
      }
    } catch (error) {
      console.error('Network or server error:', error); // Log network errors
    }

    this.formSubmitted = true;
      const instanceId = 1; // set instance ID from server response

      // Redirect after 3 seconds (3000ms)
      setTimeout(() => {
        this.$router.push({ name: 'workflow', params: { instanceid: instanceId } });
      }, 3000);
  },
  },
};
</script>

<style scoped>
.banner {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px 15px;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-wrapper {
  margin-top: 60px; /* Adjust as needed for spacing below banner */
}

.container-fluid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.navy-blue {
  color: #003366;
  font-size: 2.5rem;
  margin: 0;
}

.logo {
  height: 40px;
  width: auto;
}

.card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

/* Style for the pop-up message */
.alert {
  margin-bottom: 20px;
}
</style>
