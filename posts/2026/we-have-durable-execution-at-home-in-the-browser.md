---
title: We have durable execution at home in the browser
description: Building a browser-local durable execution engine in TypeScript
tags:
  - typescript
  - software-engineering
  - platform-engineering
  - tools
  - durable-execution
date: 2026-08-12
coverImage: /img/posts/durable-cover.png
coverImageSize: cover
coverImageHeight: 360px
---
Durable execution provides a runtime that ensures that programs execute irrespective of crashes or long-running blocking tasks. It's getting popular generally and for agentic workflows. _What if it is built for browser-local tasks fully in TypeScript using browser APIs?_ I want to build a DE engine from scratch to learn how they work by building an engine that makes long-running local tasks in the browser durable.

Let's build one.
>Demo: https://mohitk05.github.io/durable-browser/
>Code: https://github.com/mohitk05/durable-browser

Restate's [blog](https://restate.dev/what-is-durable-execution) on DE states these common principles of such engines:
1. **Journaled steps.** Every external interaction is recorded to a persistent log before its result is observed by the application. The log is the source of truth for what happened.
2. **Automatic retries with idempotency.** Failed steps are retried by the engine. Already-completed steps are not re-executed; their recorded results are replayed instead, making actions like generating an idempotency key to call an API trivial.
3. **Durable timers and signals.** Sleeps, scheduled work, and inter-service signals (like awaiting a webhook or human approval) survive crashes and process restarts. A workflow can wait days or weeks without holding a process open.
4. **Resumability.** Any in-flight execution can be recovered by any healthy worker. Recovery is transparent to the application code; there is no checkpoint logic to write.

## Example in the browser
I'll take an example and then use it to implement the engine top down.

```ts
const demoWorkflow = createWorkflow(
  "demo-workflow",
  async function demoWorkflow(ctx) {
    console.log("Workflow started");
    await ctx.sleep("10s");
    console.log("Workflow completed after 10 seconds");
  },
);
```

Let's consider the simplest of the use cases - a long-running durable sleep. This indeed can be solved with different existing mechanisms, but it's a great example to build the fundamentals of DE. Practical use cases may include an API call/a longer-running task. The expectation here is that this program should run as if running sequentially across browser tabs/windows/crashes for the same origin. If I start this workflow and refresh mid-execution, the execution should continue from its last state when the page loads, i.e. the sleep should always be 10 seconds long, irrespective of reloads/tab changes.

From the 4 principles shared by Restate, this is made possible by _journaling_ or _logging_. Each call to `step()` is logged and read back when a workflow has to be resumed. The code always runs from the beginning, but if step logs exist already, the call returns immediately and no side-effect happens more than expected number of times.

I'll used IndexedDB available in the browser to track these logs.
## Workflows, engine and logs
A workflow looks like this:

```ts
export class Workflow {
  id: string;
  ctx: WorkflowContext;

  constructor(
    private engine: DurableEngine,
    public name: string,
    public workflowFn: (ctx: WorkflowContext) => Promise<void>,
  ) {
    this.id = name;
    this.ctx = new WorkflowContext(engine, this.id);
  }

  async run(): Promise<void> {
    await this.engine.runWorkflow(this);
  }
}

export function createWorkflow(
  name: string,
  workflowFn: (ctx: WorkflowContext) => Promise<void>,
): Workflow {
  const workflow = new Workflow(globalEngine, name, workflowFn);
  globalEngine.addWorkflow(workflow);
  return workflow;
}
```

Nothing complicated, workflow is a container that holds the workflow function, a name (user's responsibility for now to make sure this is unique and constant throughout) and context. It also holds a reference to the engine and `run()` calls the engine's `runWorkflow()` method.

`createWorkflow` instantiates a workflow and lets the engine know about it. This is simply to keep a note of available workflows and I'll share why later.

The context object exposes a set of APIs available inside the workflow.

```ts
export class WorkflowContext {
  constructor(
    private engine: DurableEngine,
    private workflowId: string,
  ) {}

  async onEvent<T>(eventName: string): Promise<T> {
    return this.engine.waitForEvent<T>(this.workflowId, eventName);
  }

  async step<T>(stepFn: () => Promise<T>): Promise<T> {
    return this.engine.runStep({
      workflowId: this.workflowId,
      stepName: stepFn.name,
      stepFn,
    });
  }

  async sleep(duration: string): Promise<void> {
    const ms = parse(duration);
    if (ms === null) {
      console.warn(
        `Invalid duration "${duration}" provided to sleep. Resolving immediately.`,
      );
      return;
    }

    await this.engine.waitForTimer(this.workflowId, ms);
  }
}
```

The method implementations depend on the engine's methods to do the actual work.

The execution engine orchestrates the workflow execution. There is always one global instance of the engine which is used across all workflows.

```ts
export class DurableEngine {
  private localPendingEvents: Map<[string, LogEvent], (data: any) => void> =
    new Map();
  private workflowTimerIndexes: Map<string, number> = new Map();
  private workflows: Map<string, Workflow> = new Map();

  constructor(public db: IDBPDatabase<DurableLogDB>) {}

  addWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
    isWorkflowActive(workflow.id).then((isActive) => {
      if (isActive) {
        console.log(`[DurableEngine] Resuming active workflow: ${workflow.id}`);
        this.runWorkflow(workflow);
      }
    });
  }

  async runWorkflow(workflow: Workflow): Promise<void> {
    await markWorkflowAsActiveIfNotExists(workflow.id);
    await workflow.workflowFn(workflow.ctx);
    this.workflowTimerIndexes.delete(workflow.id);
    await markWorkflowAsInactive(workflow.id);
  }

  async runStep<T>({
    workflowId,
    stepName,
    stepFn,
  }: {
    workflowId: string;
    stepName: string;
    stepFn: () => Promise<T>;
  }): Promise<T> {}

  async signalEvent<T>(workflowId: string, eventName: string, data: T) {}

  async waitForEvent<T>(workflowId: string, eventName: string): Promise<T> {}

  async waitForTimer(workflowId: string, durationMs: number): Promise<void> {}

  private async addPendingEvent<T>(
    workflowId: string,
    eventKey: LogEvent,
    input: any,
    callback: (data: T) => void,
  ) {}

  private async createWaitForEvent<T>(
    workflowId: string,
    eventKey: LogEvent,
    input: any,
  ): Promise<T> {}
}

export const globalEngine = new DurableEngine(logsDb);
```

The engine receives a reference to the data store, here it is an IndexedDB database. The method `runStep` internally implements the _cached execution_ logic - if a result for a step in a workflow already exists in the log, return it immediately. Else, run the step and store the log.

```ts
  async runStep<T>({
    workflowId,
    stepName,
    stepFn,
  }: {
    workflowId: string;
    stepName: string;
    stepFn: () => Promise<T>;
  }): Promise<T> {
    const existingLog = await this.db.get("logs", [workflowId, stepName]);
    if (existingLog) {
      return existingLog.output as T;
    }

    const stepOutput = await stepFn();

    await this.db.put("logs", {
      workflowId,
      event: `step.${stepName}`,
      input: null,
      output: stepOutput,
      timestamp: Date.now(),
    });

    return stepOutput;
  }
```

Each `ctx.step()` is saved as a log in the IndexedDB database. The log is structured as follows:

```ts
type EventType = "step" | "pending" | "resolved";
export type LogEvent = `${EventType}.${string}`;

export interface DurableLog {
  workflowId: string;
  event: LogEvent;
  input: any;
  output: any;
  timestamp: number;
}
```

I use the prefixes `step`, `pending` and `resolved` for events to identify the type of event. E.g. here's a log for a sleep schedule event:
```ts
{
  workflowId: "demo-workflow",
  event: "pending.timer.0",
  input: null,
  output: null,
  timestamp: 1786481661490,
}
```

When the timer gets resolved, another event is appended:
```ts
{
  workflowId: "demo-workflow",
  event: "resolved.timer.0",
  input: null,
  output: null,
  timestamp: 1786481671492,
}
```
## Implementing sleep(duration)
`sleep()` is the simplest API in the durable engine. I see it as yet another set of events, and that's how I modelled it (seen in example logs above). When `ctx.sleep()` is called, under the hood the workflow calls engine's `waitForTimer` API and returns a promise back. So the execution in the workflow pauses until this promise resolves.

```ts
  async waitForTimer(workflowId: string, durationMs: number): Promise<void> {
    this.workflowTimerIndexes.set(
      workflowId,
      (this.workflowTimerIndexes.has(workflowId)
        ? this.workflowTimerIndexes.get(workflowId)!
        : -1) + 1,
    );
    const timerIndex = this.workflowTimerIndexes.get(workflowId)!;

    const timerEventKey = `pending.timer.${timerIndex}` as LogEvent,
      resolvedTimerEventKey = `resolved.timer.${timerIndex}` as LogEvent;

    console.log(
      `[DurableEngine] Waiting for timer: workflowId=${workflowId}, durationMs=${durationMs}, timerIndex=${timerIndex}`,
    );

    const existingLog = await this.db.get("logs", [
      workflowId,
      resolvedTimerEventKey,
    ]);
    if (existingLog) {
      return;
    }

    const timestamp = Date.now();

    let existingPendingLog = await this.db.get("logs", [
      workflowId,
      timerEventKey,
    ]);

    if (!existingPendingLog) {
      await this.db.put("logs", {
        workflowId,
        event: timerEventKey,
        input: null,
        output: null,
        timestamp,
      });
    }

    console.log(
      `[DurableEngine] Timer started: workflowId=${workflowId}, durationMs=${durationMs}, timerIndex=${timerIndex}`,
      existingPendingLog,
    );

    const elapsedTime =
      timestamp - (existingPendingLog?.timestamp ?? timestamp);
    const remainingTime = durationMs - elapsedTime;
    if (remainingTime <= 0) {
      await this.db.put("logs", {
        workflowId,
        event: resolvedTimerEventKey,
        input: null,
        output: null,
        timestamp: Date.now(),
      });
      return;
    } else {
      return await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await this.db.put("logs", {
            workflowId,
            event: resolvedTimerEventKey,
            input: null,
            output: null,
            timestamp: Date.now(),
          });
          resolve();
        }, remainingTime);
      });
    }
  }
```

This is what's happening in the `waitForTimer` method above:
1. The engine calculates an index for the sleep call to uniquely identify it in the workflow. The assumption is that since workflow function always executes from the beginning, the `waitForTimer` method will be called sequentially for each sleep call.
2. The pending and resolved keys for log DB are constructed, e.g. `pending.timer.0`.
3. If there is an existing resolved log for this timer, then the function returns immediately. This is because the timer has already resolved and this is probably a replay of the workflow.
4. If not, then check if there is an existing pending log. If there is one, this means the method was called as part of a replay of the workflow and the resolution of timer is still pending. If no pending log exists, add a new one.
5. Calculate the remaining time in the sleep duration. This is equal to `Date.now() - timestamp in pending log`.
6. If remaining time is <= 0, add a resolved log and return immediately.
7. Else, schedule a `setTimeout` for the remaining duration of sleep and return a promise that resolves at the end of this timeout. Once this timeout resolves, a resolved log is appended to the logs DB.

Using this mechanism, we've created a _durable sleep_ functionality! Sequential execution is ensured because the workflow uses `async/await` and the engine constructs promises to simulate durable timers.

Here's how it looks in the end:

<video controls lazy>
  <source src="/img/posts/durable-browser-1.mp4" type="video/mp4" />
</video>

## What next?
Sleep is the simplest of all, next I want to try building this for other kinds of events, imagine working with file system using the file system API in Chrome, workers and other kinds of local APIs. Imagine running fully-offline durable workflows in the browser. Add agents to this and you have offline agents running in the browser.

>Demo: https://mohitk05.github.io/durable-browser/
>Code: https://github.com/mohitk05/durable-browser