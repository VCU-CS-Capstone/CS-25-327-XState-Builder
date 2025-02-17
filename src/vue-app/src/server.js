const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { WebClient } = require('@slack/web-api');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'weezyFbaby0',
  port: 5432
});

// Slack API Configuration
const slackToken = "xoxb-7750000112467-8407139090482-YWJViyUg0cM9HzjO4yJU7gU0"; 
const web = new WebClient(slackToken);

// Slack Slash Command: Open Intake Form
app.post('/slack/intake-form', async (req, res) => {
  const { trigger_id } = req.body;

  try {
    await web.views.open({
      trigger_id: trigger_id,
      view: {
        type: "modal",
        callback_id: "intake_form",
        title: { type: "plain_text", text: "Workflow Intake Form" },
        blocks: [
          {
            type: "input",
            block_id: "instance_type",
            label: { type: "plain_text", text: "What is the instance type?" },
            element: { type: "plain_text_input", action_id: "input" }
          },
          {
            type: "input",
            block_id: "instance_subtype",
            label: { type: "plain_text", text: "What is the instance subtype?" },
            element: { type: "plain_text_input", action_id: "input" }
          },
          {
            type: "input",
            block_id: "workflow_description",
            label: { type: "plain_text", text: "Describe the workflow" },
            element: { type: "plain_text_input", multiline: true, action_id: "input" }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Submit" },
                action_id: "submit_button"
              }
            ]
          }
        ]
      }
    });

    res.send(""); 
  } catch (error) {
    console.error("Error opening Slack modal:", error);
    res.status(500).send("Failed to open Slack modal.");
  }
});

// Slack Form Submission: Save Data to Database
app.post('/slack/form-submit', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const values = payload.view.state.values;

  const instanceType = values.instance_type.input.value;
  const instanceSubtype = values.instance_subtype.input.value;
  const description = values.workflow_description.input.value;

  try {
    // Insert form data into database
    await pool.query(
      'INSERT INTO workflow_intake (instance_type, instance_subtype, description) VALUES ($1, $2, $3)',
      [instanceType, instanceSubtype, description]
    );

    // Notify Slack channel about new submission
    await web.chat.postMessage({
      channel: "#workflow-intakes", // Change to the Slack channel where you want notifications
      text: `*New Workflow Intake Submitted:*\n *Instance Type:* ${instanceType}\n *Instance Subtype:* ${instanceSubtype}`
    });

    res.send(""); // Acknowledge Slack event
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Failed to save form data.");
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const instanceid = req.query.instanceid;
    let result;

    if (instanceid) {
      result = await pool.query('SELECT * FROM tasks WHERE instanceid = $1', [instanceid]);
    } else {
      result = await pool.query('SELECT * FROM tasks');
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).send('Error retrieving tasks');
  }
});

app.get('/instances', async (req, res) => {
  try {
    const result = await pool.query('SELECT instanceid, instancename FROM instances');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving instances:', error);
    res.status(500).send('Error retrieving instances');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
