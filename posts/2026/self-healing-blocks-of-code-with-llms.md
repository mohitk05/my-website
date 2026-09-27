---
title: Self-healing blocks of code with LLMs
date: 2026-08-03
tags:
  - llms
  - programming-languages
  - software-engineering
eleventyExcludeFromCollections: true
---

- A code block that monitors a piece of code, checks for errors in that block
  - If errors increase, attempts to find a fix using a local LLM
  - Tries the fix for a slice of runs
  - Applies the fix if successful
  - Triggers a PR in the background
