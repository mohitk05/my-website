---
title: A survey of automated mobile UI testing tools - Part 1
tags:
  - testing
  - systems
  - software-engineering
date: 2026-07-12
eleventyExcludeFromCollections: true
---

- Survey of popular mobile automated testing tools
- The problem of platform differences
  - For large orgs, usually you'd build across both platforms and expects consistent outputs
- Android
  - Espresso, UIAutomator
- iOS
  - XCUITest
- Solving the cross-platform problem
  - Appium
  - Maestro
- The weight of abstractions
  - Why appium is slow
  - Why maestro is fast
- Middleground?

End-to-end testing is the last line of defence against user-facing regressions in your product; regressions that would get missed in unit or integration testing. E2Es, while important, are the most difficult of the tests to execute and maintain - which is why they are placed at the top of the testing pyramid. I have been working extensively with E2E testing for Zalando's client platforms and have recently dabbled a lot into mobile testing and explored how various existing frameworks work in order to figure out a problem I was looking to solve.

This post is a survey of various
