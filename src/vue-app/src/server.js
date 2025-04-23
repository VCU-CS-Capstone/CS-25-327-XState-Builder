require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const { Octokit } = require("@octokit/rest");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASS || 'weezyFbaby0',
  port: process.env.DB_PORT || 5432
});

// Initialize Octokit for GitHub API access
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Route: Intake Form Submission from Vue (POST /api/intake)
app.post('/api/intake', async (req, res) => {
  try {
    // Expecting JSON with: instanceType, instanceSubtype, description, and states (an array)
    const { instanceType, instanceSubtype, description, states } = req.body;

    // Insert the main intake data into workflow_intake
    const insertIntakeQuery = `
      INSERT INTO workflow_intake (instance_type, instance_subtype, description)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const intakeResult = await pool.query(insertIntakeQuery, [instanceType, instanceSubtype, description]);
    const newIntakeId = intakeResult.rows[0].id;

    // Insert associated workflow states (if provided)
    if (states && Array.isArray(states)) {
      for (const state of states) {
        const insertStateQuery = `
          INSERT INTO workflow_states (intake_id, state_name, description, events, actions, target_state)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(insertStateQuery, [
          newIntakeId,
          state.name,
          state.description,
          JSON.stringify(state.events),   // storing events as JSON
          JSON.stringify(state.actions),   // storing actions as JSON
          state.targetState
        ]);
      }
    }

    res.status(201).json({ message: 'Form data saved successfully', intakeId: newIntakeId });
  } catch (error) {
    console.error('Error inserting intake data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Generate XState JSON from stored intake data (GET /api/generate-xstate/:intakeId)
app.get('/api/generate-xstate/:intakeId', async (req, res) => {
  try {
    const { intakeId } = req.params;

    // Retrieve the intake record
    const intakeResult = await pool.query('SELECT * FROM workflow_intake WHERE id = $1', [intakeId]);
    if (intakeResult.rowCount === 0) {
      return res.status(404).json({ error: 'Intake not found' });
    }

    // Retrieve the associated workflow states
    const statesResult = await pool.query('SELECT * FROM workflow_states WHERE intake_id = $1', [intakeId]);

    // Build a basic XState machine definition based on the stored data
    const machineDefinition = {
      id: 'workflow',
      initial: statesResult.rows.length ? statesResult.rows[0].state_name : 'start',
      states: {}
    };

    statesResult.rows.forEach((row) => {
      machineDefinition.states[row.state_name] = {
        on: {}
      };
      // Assume row.events is a JSON array of event names; assign the common target state for this example.
      const events = JSON.parse(row.events || '[]');
      events.forEach((evt) => {
        machineDefinition.states[row.state_name].on[evt] = row.target_state;
      });
    });

    res.json(machineDefinition);
  } catch (error) {
    console.error('Error generating XState JSON:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // Route: Create GitHub PR with the generated XState JSON (POST /api/create-pr)
// app.post('/api/create-pr', async (req, res) => {
//   try {
//     const { intakeId } = req.body;
//     if (!intakeId) {
//       return res.status(400).json({ error: 'intakeId is required' });
//     }

//     // Generate the XState JSON as in the GET route above
//     const intakeResult = await pool.query('SELECT * FROM workflow_intake WHERE id = $1', [intakeId]);
//     if (intakeResult.rowCount === 0) {
//       return res.status(404).json({ error: 'Intake not found' });
//     }
//     const statesResult = await pool.query('SELECT * FROM workflow_states WHERE intake_id = $1', [intakeId]);
//     const machineDefinition = {
//       id: 'workflow',
//       initial: statesResult.rows.length ? statesResult.rows[0].state_name : 'start',
//       states: {}
//     };
//     statesResult.rows.forEach((row) => {
//       machineDefinition.states[row.state_name] = {
//         on: {}
//       };
//       const events = JSON.parse(row.events || '[]');
//       events.forEach((evt) => {
//         machineDefinition.states[row.state_name].on[evt] = row.target_state;
//       });
//     });

//     // Convert the JSON to a formatted string and then to base64
//     const xstateJsonString = JSON.stringify(machineDefinition, null, 2);
//     const base64Content = Buffer.from(xstateJsonString).toString('base64');

//     // GitHub configuration (from environment variables)
//     const owner = process.env.GITHUB_OWNER;
//     const repo = process.env.GITHUB_REPO;
//     const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
//     const newBranchName = `intake-xstate-${intakeId}`;

//     // Get the SHA of the base branch
//     const { data: baseBranchData } = await octokit.git.getRef({
//       owner,
//       repo,
//       ref: `heads/${baseBranch}`
//     });
//     const baseSha = baseBranchData.object.sha;

//     // Create a new branch from the base branch
//     try {
//       await octokit.git.createRef({
//         owner,
//         repo,
//         ref: `refs/heads/${newBranchName}`,
//         sha: baseSha,
//       });
//     } catch (err) {
//       // If branch creation fails (e.g., branch already exists), log and return an error.
//       console.error('Error creating branch:', err);
//       return res.status(500).json({ error: 'Failed to create branch for PR' });
//     }

//     //Create or update the JSON file in the new branch
//     const filePath = `workflows/xstate-${intakeId}.json`;
//     const commitMessage = `Add XState JSON for intake ${intakeId}`;
//     await octokit.repos.createOrUpdateFileContents({
//       owner,
//       repo,
//       path: filePath,
//       message: commitMessage,
//       content: base64Content,
//       branch: newBranchName,
//     });

//     // Create a Pull Request from the new branch to the base branch
//     const { data: pr } = await octokit.pulls.create({
//       owner,
//       repo,
//       title: `Add XState JSON for intake ${intakeId}`,
//       head: newBranchName,
//       base: baseBranch,
//       body: `This PR adds the generated XState JSON for intake ${intakeId}.`,
//     });

//     res.status(201).json({ message: 'PR created successfully', prUrl: pr.html_url });
//   } catch (error) {
//     console.error('Error creating PR:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.use(express.text());
app.post('/api/create-pr', async (req, res) => {
  try {

    console.log('Received Payload:', req.body);

    const machineCode = req.body;

    //const { machineCode } = req.body; 
    // if (!machineCode || typeof machineCode !== 'string' || machineCode.trim() === '') {
    //   return res.status(400).json({ error: 'Valid XState machine code is required' });
    // }    

    const base64Content = Buffer.from(String(machineCode)).toString('base64');
    //const base64Content = Buffer.from(machineCode).toString('base64');
    console.log('Base64 Encoded Machine Code:', base64Content);


    // GitHub configuration (from environment variables)
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
    const newBranchName = `xstate-update-${Date.now()}`; // Unique branch name

    // Get the SHA of the base branch
    const { data: baseBranchData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    const baseSha = baseBranchData.object.sha;

    // Create a new branch from the base branch
    try {
      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: baseSha,
      });
    } catch (err) {
      console.error('Error creating branch:', err);
      return res.status(500).json({ error: 'Failed to create branch for PR' });
    }

    // Create or update the `.js` file in the new branch
    const filePath = `workflows/taskMachine-${Date.now()}.js`; // Use `.js` extension
    const commitMessage = 'Add XState machine code';
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(machineCode).toString('base64'), // Encode JavaScript code in base64
      branch: newBranchName,
    });

    // Create a Pull Request from the new branch to the base branch
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title: 'Add XState machine code',
      head: newBranchName,
      base: baseBranch,
      body: 'This PR contains the submitted XState machine code.',
    });

    res.status(201).json({ message: 'PR created successfully', prUrl: pr.html_url });
  } catch (error) {
    console.error('Error creating PR:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    const result = await pool.query('SELECT instanceid, name FROM instances');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving instances:', error);
    res.status(500).send('Error retrieving instances');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
