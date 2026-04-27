---
title: "TIL: About transactional outbox pattern"
description: Consistency in distributed systems when emitting an event after a database write
tags:
  - til
  - distributed-systems
  - systems
  - databases
date: 2026-04-24
---
_Transactional outbox pattern_ is a way to ensure consistency (via atomicity) in distributed systems when an application writes to a database and then emits an event to a event broker or queue. There is a possibility that between these to operations a fault occurs and the system may end up in a faulty state where the database/application sees that the write occurred but the consumers of the event never receive this notification.

```ts
order = db.run("INSERT INTO orders (...) values (...)", [...]) 
// <-- app breaks here
eventBroker.publish({ event_name: "ORDER", id: order.id })
```

One idea is to convert the entire flow into one single operation using a 2-phase commit. But this is at times difficult to implement at an application level. The solution is to use the _outbox pattern_. The main idea is to use the database's transactions and atomicity guarantees to ensure that the operations: a. write to database and b. emit and event - both _consistently happen_. I.e. if the write happens then the event definitely gets emitted.

![outbox-pattern.png](/img/posts/outbox-pattern.png)

The flow looks like follows:
1. When writing to the database, we use a transaction to write an additional "outbox" entry for the event that is supposed to be fired to a new table (if relational DB for example). Since we use a transaction, both the original write (e.g. order) and the outbox write will either succeed or fail _together_, i.e. (both or none).
2. A message relay (which could be an independent job/cron process) keeps checking the outbox table and looks for entries which contain a flag which denotes the event is yet to be published. The relay then publishes the event and marks it accordingly. In case the relay suffers from a fault, it picks up the unpublished event the next time it runs.

The pattern may lead to some latency for the event delivery and may also lead to publishing the event more than once (if the relay goes down just after publishing and before marking the event as published). But this is acceptable in async systems usually is solved by event consumers being idempotent and handling more-than-once delivery.



