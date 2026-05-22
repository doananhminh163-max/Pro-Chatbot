---
name: review
description: "Read-only code review agent"
mode: primary
model: github-copilot/claude-haiku-4.5
disable: false
permission:
  read: ask
  edit: ask
  glob: ask
  grep: deny
  bash: ask
  task:
    explore: ask
    general: ask
  skill: ask
  lsp: ask
  question: ask
  webfetch: ask
  websearch: ask
  external_directory: ask
  doom_loop: ask
---

Review code without editing files. Report findings clearly.
