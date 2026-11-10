---
title: Use feature flags in CI/CD pipelines
date: 2026-11-02
description: For platform teams, a shared CI/CD pipeline is a product. And it needs feature flagging.
tags:
  - platform-engineering
  - software-engineering
---
>tldr: use feature flags in your CI pipelines if you own a developer/agentic platform and treat it more like a real product.

For platform teams owning infrastructure and developer/agentic experience, CI pipelines are a core product of the platform offering. When a PR is raised, or a commit is pushed (if you already have moved on from PRs), a workflow kicks in which runs a bunch of things: tests, build scripts, deployments, releases, monitoring etc.

Over the years working with platforms I've felt that application code and pipelines are often tightly coupled. This is highlighted more in a mono-repository setup where your workflow.yaml files are alongside your application files and every push/merge leads to a pipeline run. As the platform scales and human/agent contributors increase, the time to adapt a pipeline has to be quick. Additionally, when changes are introduced in the pipeline, they should be failsafe and revert-able.

The best solution in the industry is _feature flagging_!

I don't see this being done more commonly (probably my org is at a state where this actually becomes a problem) - use feature flags for your pipeline if you are part of a platform team. 

Let me share some concrete examples:
* **Broken tests**: You find out one of your tests has become flaky and you need to quarantine it until a team reviews it. A traditional workflow would create a PR to skip/quarantine that test or update the pipeline/test config to skip the test. What if you sourced a _skip list_ from a remote dynamic config? Using platforms like LaunchDarkly or any OpenFeature compatible tooling, you can define a config named `tests.skip_list` which holds an array of test names to be skipped and you target the repo using context filters.
* **Introducing new steps**: Let's say you are adding a new workflow which runs a script and uploads something to an S3 bucket. You've tested this in a PR setup, but the script depends on the contents of the PR so you are not sure if it will work for all kinds of PRs. Or you simply haven't tested enough. Traditionally, you would merge the change and pray that it works and if it doesn't you'd raise a revert PR. A better way to do this would be to introduce a config called `pipeline.enable_new_script` and set it to `false` by default. Then you safely merge it and then update the config to gradually introduce it.

We use a OpenFeature compatible system internally at Zalando called _Nova_. I recently introduced a dynamic configuration that controls behaviour across pipelines. It looks something like this:

```yaml
configuration:
  schema_version: 1
  configuration_version: 1

  defaults:
    - name: cdp-pipeline
      parameters: []
      namespaces:
        - name: zalando-app
          parameters:
            - name: test-suites
              type: string
              value: "unit,integration,smoke"
            - name: e2e-tests-enabled
              type: boolean
              value: true
```

And then in the pipeline, a CLI resolves the value of these keys using the pipeline ID as the unique identifier for the resolution algorithm.

```bash
SUITES=$(novacfg get cdp-pipeline.zalando-app.test-suites --default unit)

echo $SUITES  # prints unit,integration,smoke

IFS=',' read -ra suite_list <<< "$SUITES"
for suite in "${suite_list[@]}"; do
  pnpm test "$suite" || exit 1
done
```

You can start with simple key-value config and then later use more complex rollout mechanisms if you have the user base for it to make sense. E.g. if you have hundreds of users, if might make sense to roll out a change to 10% users first, see the behaviour/identify regressions/improvements and then roll out to 100%.

I'm trying this in my team, will report back in a few months how this goes.