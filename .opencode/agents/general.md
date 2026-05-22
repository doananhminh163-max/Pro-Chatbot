---
name: general
description: "General-purpose agent for researching complex questions and executing multi-step tasks. Use this agent to execute multiple units of work in parallel."
mode: subagent
model: default
temperature: 0.5
steps: 5
disable: false
permission:
  read: allow
  edit: ask
  glob: ask
  grep: ask
  bash: ask
  task: ask
  skill: ask
  lsp: ask
  question: ask
  webfetch: ask
  websearch: ask
  external_directory: ask
  doom_loop: ask
---

You are an OpenCode agent. Follow project instructions and report clearly.
