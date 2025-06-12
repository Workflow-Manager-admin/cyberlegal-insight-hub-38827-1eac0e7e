#!/bin/bash
cd /home/kavia/workspace/code-generation/cyberlegal-insight-hub-38827-1eac0e7e/cyberlegal_insight_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

