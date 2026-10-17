#!/usr/bin/env node

/**
 * Ralph Loop Autonomous Runner
 * Philosophy: "Dumb loops beat clever workflows."
 * Fresh context on every iteration, state persists via Git, PRD.md, and progress.txt.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const PRD_FILE = path.join(__dirname, 'PRD.md');
const PROGRESS_FILE = path.join(__dirname, 'progress.txt');

// Parse CLI args
const args = process.argv.slice(2);
const maxIterations = parseInt(args[0], 10) || 10;
const customTool = args[1] || process.env.RALPH_TOOL || 'auto';

console.log('\n========================================================');
console.log(' 🔁 RALPH LOOP: Autonomous AI Development Runner');
console.log(` 🎯 Max Iterations: ${maxIterations}`);
console.log(` 🛠️  Configured Tool: ${customTool}`);
console.log('========================================================\n');

// Detect available AI CLI tool
function detectTool() {
  if (customTool !== 'auto') return customTool;

  const candidates = ['claude', 'amp', 'agy', 'gemini', 'cursor', 'aider'];
  for (const cmd of candidates) {
    try {
      const checkCmd = process.platform === 'win32' ? `where.exe ${cmd}` : `which ${cmd}`;
      execSync(checkCmd, { stdio: 'ignore' });
      return cmd;
    } catch (e) {
      // not found
    }
  }
  return null;
}

// Check PRD for pending tasks
function getPendingTasks() {
  if (!fs.existsSync(PRD_FILE)) {
    console.error('❌ Error: PRD.md not found in project root.');
    process.exit(1);
  }

  const content = fs.readFileSync(PRD_FILE, 'utf8');
  const matches = content.match(/- \[ \] (.+)/g);
  return matches || [];
}

const activeTool = detectTool();

if (!activeTool) {
  console.log('⚠️  Notice: No external AI CLI tool (claude, agy, amp, gemini, aider) was detected in PATH.');
  console.log('💡 You can run Ralph Loop directly inside your Antigravity IDE or terminal:');
  console.log('   • With Antigravity IDE: Use the slash command `/goal` with the prompt below.');
  console.log('   • With Claude Code: Run `npm run ralph -- claude` after installing claude-code.');
  console.log('   • With Aider: Run `npm run ralph -- aider`\n');
}

// Build standardized Ralph prompt
function buildPrompt(iteration) {
  return `You are running in Ralph Loop iteration ${iteration}.
Read @PRD.md and @progress.txt.
1. Find the highest-priority incomplete task (- [ ]) from PRD.md.
2. Implement that single task thoroughly.
3. Run "npx tsc --noEmit" to verify TypeScript compilation passes.
4. Mark the task as completed (- [x]) in PRD.md.
5. Append a clear iteration summary to progress.txt.
6. Commit your changes with an atomic git commit message.
If all tasks in PRD.md are completed, output the exact string: <promise>COMPLETE</promise>`;
}

// Main Loop
async function runLoop() {
  for (let i = 1; i <= maxIterations; i++) {
    const pendingTasks = getPendingTasks();
    console.log(`\n--------------------------------------------------------`);
    console.log(`🔄 Ralph Loop Iteration ${i} of ${maxIterations}`);
    console.log(`📌 Incomplete tasks remaining: ${pendingTasks.length}`);
    if (pendingTasks.length > 0) {
      console.log(`   Next: ${pendingTasks[0]}`);
    }
    console.log(`--------------------------------------------------------\n`);

    if (pendingTasks.length === 0) {
      console.log('🎉 All tasks in PRD.md have been completed! Exiting loop successfully.');
      break;
    }

    const prompt = buildPrompt(i);

    if (activeTool) {
      console.log(`🤖 Spawning agent session with: ${activeTool}...\n`);
      let commandArgs = [];

      if (activeTool === 'claude') {
        commandArgs = ['--permission-mode', 'acceptEdits', '-p', prompt];
      } else if (activeTool === 'agy') {
        commandArgs = ['prompt', prompt];
      } else if (activeTool === 'aider') {
        commandArgs = ['--message', prompt, '--yes'];
      } else {
        commandArgs = [prompt];
      }

      const proc = spawnSync(activeTool, commandArgs, {
        stdio: 'inherit',
        shell: true,
        encoding: 'utf8',
      });

      // Check git diff status
      try {
        const status = execSync('git status --short', { encoding: 'utf8' }).trim();
        if (status) {
          console.log('\n📝 Detected repository changes in this iteration:');
          console.log(status);
        }
      } catch (e) {}

    } else {
      console.log('📋 Prompt for this iteration:');
      console.log('--------------------------------------------------');
      console.log(prompt);
      console.log('--------------------------------------------------');
      console.log('👉 To run automatically, install an AI CLI or run via Antigravity IDE goal mode.');
      break;
    }
  }

  console.log('\n🏁 Ralph Loop session ended.\n');
}

runLoop();
