#!/usr/bin/env bash
# ==============================================================================
# Ralph Loop Autonomous Development Script (Bash)
# Philosophy: "Dumb loops beat clever workflows."
# ==============================================================================

set -e

MAX_ITERATIONS=${1:-10}
TOOL=${2:-"auto"}

echo ""
echo "========================================================"
echo " 🔁 RALPH LOOP: Autonomous AI Development Runner"
echo " 🎯 Max Iterations: $MAX_ITERATIONS"
echo "========================================================"
echo ""

if [ ! -f "PRD.md" ]; then
    echo "❌ Error: PRD.md not found in repository root."
    exit 1
fi

# Detect AI CLI
if [ "$TOOL" = "auto" ]; then
    for cmd in claude amp agy gemini cursor aider; do
        if command -v "$cmd" >/dev/null 2>&1; then
            TOOL="$cmd"
            break
        fi
    done
fi

for ((i=1; i<=MAX_ITERATIONS; i++)); do
    echo "--------------------------------------------------------"
    echo "🔄 Ralph Loop Iteration $i of $MAX_ITERATIONS"
    echo "--------------------------------------------------------"

    PROMPT="You are running in Ralph Loop iteration $i.
Read @PRD.md and @progress.txt.
1. Find the highest-priority incomplete task (- [ ]) from PRD.md.
2. Implement that single task only.
3. Run 'npx tsc --noEmit' to verify TypeScript compilation.
4. Mark the task as completed (- [x]) in PRD.md.
5. Append your progress clearly to progress.txt.
6. Commit your changes with an atomic git commit message.
If all tasks in PRD.md are completed, output the exact string: <promise>COMPLETE</promise>"

    if [ "$TOOL" != "auto" ]; then
        echo "🤖 Spawning $TOOL session..."
        if [ "$TOOL" = "claude" ]; then
            result=$(claude --permission-mode acceptEdits -p "$PROMPT")
        elif [ "$TOOL" = "agy" ]; then
            result=$(agy prompt "$PROMPT")
        elif [ "$TOOL" = "aider" ]; then
            result=$(aider --message "$PROMPT" --yes)
        else
            result=$($TOOL "$PROMPT")
        fi

        echo "$result"

        if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
            echo "🎉 Ralph Loop completed all tasks successfully after $i iterations!"
            exit 0
        fi
    else
        echo "⚠️  No AI CLI tool detected in PATH."
        echo "💡 Run iteration in Antigravity IDE using /goal or run: node ralph.js"
        break
    fi

    sleep 2
done

echo "🏁 Ralph Loop finished."
