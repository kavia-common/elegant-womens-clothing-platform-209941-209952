#!/bin/bash
cd /home/kavia/workspace/code-generation/elegant-womens-clothing-platform-209941-209952/backend_express_js
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

