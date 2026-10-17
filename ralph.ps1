# ==============================================================================
# Ralph Loop Autonomous Development Script (PowerShell)
# Philosophy: "Dumb loops beat clever workflows."
# Each iteration spawns a fresh agent session. Context is held in files and Git.
# ==============================================================================

param(
    [int]$MaxIterations = 10,
    [string]$Tool = "auto"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " 🔁 RALPH LOOP: Autonomous AI Development Runner" -ForegroundColor Yellow
Write-Host " 🎯 Max Iterations: $MaxIterations" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$PRD_PATH = Join-Path $PSScriptRoot "PRD.md"
$PROGRESS_PATH = Join-Path $PSScriptRoot "progress.txt"

if (-not (Test-Path $PRD_PATH)) {
    Write-Host "❌ Error: PRD.md not found in repository root." -ForegroundColor Red
    exit 1
}

# Detect available AI CLI
$ActiveTool = $Tool
if ($Tool -eq "auto") {
    $candidates = @("claude", "amp", "agy", "gemini", "cursor", "aider")
    foreach ($c in $candidates) {
        $found = Get-Command $c -ErrorAction SilentlyContinue
        if ($found) {
            $ActiveTool = $c
            break
        }
    }
}

if ($ActiveTool -eq "auto") {
    Write-Host "⚠️  No external CLI agent (claude, agy, amp, gemini, aider) was detected in PATH." -ForegroundColor Yellow
    Write-Host "💡 In Antigravity IDE, you can run the Ralph goal loop using the /goal command." -ForegroundColor Cyan
    Write-Host ""
}

for ($i = 1; $i -le $MaxIterations; $i++) {
    # Check pending tasks
    $content = Get-Content $PRD_PATH -Raw
    $pendingTasks = [regex]::Matches($content, "- \[ \] (.+)")

    Write-Host ""
    Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "🔄 Ralph Loop Iteration $i of $MaxIterations" -ForegroundColor Cyan
    Write-Host "📌 Remaining Incomplete Tasks: $($pendingTasks.Count)" -ForegroundColor Yellow
    if ($pendingTasks.Count -gt 0) {
        Write-Host "   Next: $($pendingTasks[0].Value)" -ForegroundColor White
    }
    Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host ""

    if ($pendingTasks.Count -eq 0) {
        Write-Host "🎉 All tasks in PRD.md are completed! Exiting Ralph loop." -ForegroundColor Green
        exit 0
    }

    $prompt = @"
You are running in Ralph Loop iteration $i.
Read @PRD.md and @progress.txt.
1. Find the highest-priority incomplete task (- [ ]) from PRD.md.
2. Implement that single task only.
3. Run "npx tsc --noEmit" to verify TypeScript compilation.
4. Mark the task as completed (- [x]) in PRD.md.
5. Append your progress clearly to progress.txt.
6. Commit your changes with an atomic git commit message.
If all tasks in PRD.md are completed, output the exact string: <promise>COMPLETE</promise>
"@

    if ($ActiveTool -ne "auto") {
        Write-Host "🤖 Spawning $ActiveTool agent session..." -ForegroundColor Magenta
        
        $output = ""
        if ($ActiveTool -eq "claude") {
            $output = & claude --permission-mode acceptEdits -p $prompt
        } elseif ($ActiveTool -eq "agy") {
            $output = & agy prompt $prompt
        } elseif ($ActiveTool -eq "aider") {
            $output = & aider --message $prompt --yes
        } else {
            $output = & $ActiveTool $prompt
        }

        Write-Host $output

        if ($output -match "<promise>COMPLETE</promise>") {
            Write-Host "🎉 Ralph Loop completed all tasks successfully after $i iterations!" -ForegroundColor Green
            exit 0
        }
    } else {
        Write-Host "Iteration $i Prompt:" -ForegroundColor Gray
        Write-Host $prompt -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "👉 Install an AI CLI or use Antigravity /goal command to run iterations automatically." -ForegroundColor Yellow
        break
    }

    Start-Sleep -Seconds 2
}

Write-Host "🏁 Ralph Loop reached iteration limit or finished." -ForegroundColor Cyan
