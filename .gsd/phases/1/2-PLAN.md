---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Onboarding Flow

## Objective
Implement the 8-step onboarding flow and persist user preferences/finances to local storage.

## Context
- .gsd/SPEC.md

## Tasks

<task type="auto">
  <name>Setup Local Storage Utility</name>
  <files>src/utils/storage.js</files>
  <action>
    - Create a utility to safely read and write to `localStorage`.
    - Handle JSON serialization and error catching.
  </action>
  <verify>node -e "require('fs').existsSync('src/utils/storage.js')"</verify>
  <done>Storage utility handles saving and loading user state.</done>
</task>

<task type="auto">
  <name>Build Onboarding Screens</name>
  <files>src/components/Onboarding.jsx, src/App.jsx</files>
  <action>
    - Create a multi-step form covering: mode (student/salaried), income, expenses, goals, emergency fund, risk profile, theme.
    - Save the completed profile using the storage utility.
    - Update `App.jsx` to conditionally render the Onboarding component if no profile exists.
  </action>
  <verify>npm run build</verify>
  <done>Onboarding flow correctly collects and saves user data.</done>
</task>
