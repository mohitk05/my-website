---
title: Implementing the Raft consensus algorithm in Node.js
date: 2025-02-24
coverImage: /img/covers/raft.png
tags:
  - systems
  - software-engineering
  - algorithms
description: Raft consensus algorithm in Node.js and TypeScript
---

<style>
pre {
	max-height: 600px;
	 overflow: scroll;
}

@media (min-width: 1024px) {
  .raft-video {
    max-width: 150%;
    margin-left: -25%;
  }
}
</style>

> The implementation can be found here: [raft-node](https://github.com/mohitk05/raft-node)

Raft is a popular consensus algorithm that aims for _understandability_. The problem of consensus, or agreeing upon a decision as a group, usually comes up in replicated state machines - where state is replicated over multiple servers in a system. To client, the system appears as one unit, but internally it orchestrates state changes such that the system keeps behaving as usual even if one of the servers stops. A simplest example of a replicated state machine is a distributed key-value store.

A replicated state machine is made possible using a _write-ahead log_. It is a series of _log events_ that describe actions to be applied on the state, e.g. in case of a KV store: `set`, `delete` . The correctness of the state machine is achieved by ensuring that all servers in the system apply the same log entries in the same order to their instances of the state machine, ensuring that every server has the correct state.

Servers in Raft can be in one of the 3 states: follower, candidate or leader. A follower receives log entries via RPC that should be applied to the state machine. On startup, every server starts as a follower. A candidate is a to-be leader and if enough conditions are met, it moves to the leader state. The leader is the one who directs followers to apply changes as per client requests.

The algorithm is described in the Raft paper and comprises of three main parts:

1. **Leader election:** In this phase, a new leader is elected. On startup, every server is a follower and kicks off a timer for a random timeout. The server which finishes its timer first moves on to become a candidate. As soon as it moves to the candidate state, it sends an RPC call to every other server to request for a vote. When other servers are still waiting for their timeouts, and they receive this request to vote, they invalidate their timers and respond back with a vote. The candidate then checks if it has gotten a majority vote (>50% \* n*servers) and if it did then moves to the leader state and announces this to all followers. With this the leader election ends and this round is called a \_term* which will last until the leader terminates due to some fault.
2. **Log replication:** Once the leader has been elected, it starts sending heart beat requests to all other servers. These requests are sent periodically, and in case of new requests from the client, carry the log entries as payload to servers. In other cases, they are a way for followers to know that the leader is still available.
   When a client request arrives, the leader updates its log and adds the entries there. Then, it sends requests to all followers to update their entries. Once everyone responds with success, the leader applies the entry to its own state machine and responds back to the client. In case some followers fail to respond, the leader returns the result to the client but keeps asking followers to update their log entries.
3. **Recovery and safety:** Every leader has the most updated log entries in order and it is never overwritten. Leaders are chosen accordingly, candidates that have complete log entries until the time of election are chosen for becoming the leader.

## Implementation in Node.js and TypeScript

I implemented the algorithm in Node.js and the complete code can be found on GitHub:
https://github.com/mohitk05/raft-node

<video src="/img/vid/raft.mp4" muted autoplay loop controls style="border-radius:4px;" class="raft-video"></video>

The main logic is placed in the `RaftNode` class in `src/node.ts`. Here's the complete code:

```ts
// src/node.ts

import * as express from "express";
import { Store } from "./state-machine";

enum State {
  Follower,
  Candidate,
  Leader,
}

export interface ServerConfig {
  address: string;
  port: number;
  index: number;
}

export enum LogType {
  Beat = "Beat",
  Set = "Set",
  Del = "Del",
}

export interface LogEntry {
  type: LogType;
  args: string[];
  index: number;
  term: number;
}

interface AppendEntriesParams {
  term: number;
  leaderId: number;
  prevLogIndex: number;
  prevLogTerm: number;
  entries: LogEntry[];
  leaderCommit: number;
}

interface RequestVoteParams {
  term: number;
  candidateId: number;
  lastLogIndex: number;
  lastLogTerm: number;
}

const APPEND_ENTRIES_PATH = "/append-entries",
  REQUEST_VOTE_PATH = "/request-vote";

export class RaftNode {
  state: State = State.Follower;
  currentTerm: number = 0;
  votedFor: number | null = null;
  log: LogEntry[] = [];

  // volatile
  commitIndex: number = 0;
  lastApplied: number = 0;

  // for servers
  nextIndex: Record<number, number>;
  matchIndex: Record<number, number>;

  // internals
  private _index: number;
  private _servers: ServerConfig[];
  private _store: Store;
  private _expressRaft: express.Express = express();
  private _expressKV: express.Express = express();
  private _portKV: number;
  private _raftPort: number;
  private _leaderElectionTimeout: NodeJS.Timeout | null = null;
  private _heartbeatTimeout: NodeJS.Timeout | null = null;

  constructor({
    port,
    index,
    servers,
  }: {
    port: number;
    index: number;
    servers: ServerConfig[];
  }) {
    this._index = index;
    this._servers = servers;
    this._portKV = port;
    this._raftPort = servers[index].port;

    this.log.push({
      type: LogType.Beat,
      args: [],
      index: this.log.length,
      term: this.currentTerm,
    });

    this._store = new Store();
    console.log(port, index, servers);
    this.setupRaftHandler();
    this._expressRaft.listen(this._raftPort, () => {
      this.logToConsole("Started raft server");
      this.resetLeaderElectionTimeout();
    });

    this.setupKVHandler();
    this._expressKV.listen(this._portKV, () => {
      this.logToConsole("Started KV server");
    });
  }

  cleanup() {
    if (this._heartbeatTimeout) {
      clearTimeout(this._heartbeatTimeout);
    }

    if (this._leaderElectionTimeout) {
      clearTimeout(this._leaderElectionTimeout);
    }
  }

  private logToConsole(...args: unknown[]) {
    console.log(`Node ${this._index}: `, ...args);
  }

  get address() {
    return `http://localhost:${this._portKV}`;
  }

  private setupKVHandler() {
    this._expressKV.use(express.json());
    this._expressKV.get("/get", (req, res) => {
      const key = req.query.key as string;
      if (!key) {
        res.status(400).send("Key not provided");
      }
      this.logToConsole(this._store.get(key));
      res.send({
        data: this._store.get(key) || "",
      });
    });

    this._expressKV.post("/set", async (req, res) => {
      if (this.state !== State.Leader) {
        res.status(400).send("This node is not the leader, cannot set");
        return;
      }
      const key = req.query.key as string,
        value = req.query.value as string;
      if (!key || !value) {
        res.status(400).send("Key and value required");
        return;
      }

      const entry: LogEntry = {
        type: LogType.Set,
        args: [key, value],
        index: this.log.length,
        term: this.currentTerm,
      };

      const result = await this.rpcAppendEntries([entry]);
      this.log.push(entry);
      this.logToConsole("/set", result);
      if (result) {
        this._store.apply([entry]);
        this.logToConsole("/set", this._store.get(key));
      }

      res.send("Done");
    });
  }

  private setupRaftHandler() {
    this._expressRaft.use(express.json());
    this._expressRaft.post<{}, {}, AppendEntriesParams>(
      APPEND_ENTRIES_PATH,
      (req, res) => {
        const result = this.AppendEntries(req.body);
        res.send(result);
      }
    );
    this._expressRaft.post<{}, {}, RequestVoteParams>(
      REQUEST_VOTE_PATH,
      (req, res) => {
        const result = this.RequestVote(req.body);
        res.send(result);
      }
    );
  }

  private async heartbeat() {
    this._heartbeatTimeout = setTimeout(() => {
      this.heartbeat();
    }, 500);
    this.rpcAppendEntries([
      {
        type: LogType.Beat,
        args: [],
        index: this.log.length,
        term: this.currentTerm,
      },
    ]);
  }

  private async rpcAppendEntries(entries: LogEntry[]) {
    if (this.state !== State.Leader) return false;
    const results = await Promise.all<{
      term: number;
      success: boolean;
    }>(
      this._servers
        .filter((s, i) => i !== this._index)
        .map((s) =>
          fetch(s.address + APPEND_ENTRIES_PATH, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              term: this.currentTerm,
              leaderId: this._index,
              prevLogIndex: this.log[this.log.length - 1].index,
              prevLogTerm: this.log[this.log.length - 1].term,
              entries,
              leaderCommit: this.commitIndex,
            }),
          })
            .then((res) => res.json())
            .catch(() => ({ success: false }))
        )
    );

    return results.every((r) => r.success);
  }

  private async rpcRequestVote() {
    if (this.state !== State.Candidate) return false;
    const results = await Promise.all<{
      term: number;
      voteGranted: boolean;
    }>(
      this._servers
        .filter((s, i) => i !== this._index)
        .map((s) =>
          fetch(s.address + REQUEST_VOTE_PATH, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              term: this.currentTerm,
              candidateId: this._index,
              lastLogIndex: this.log.length - 1,
              lastLogTerm: this.log[this.log.length - 1].term,
            }),
          })
            .then((res) => res.json())
            .catch(() => ({ voteGranted: null }))
        )
    );

    // self vote
    results.push({ term: this.currentTerm, voteGranted: true });

    this.logToConsole("rpcRequestVote", results);
    return (
      results.filter((r) => r.voteGranted !== null).filter((r) => r.voteGranted)
        .length >
      this._servers.length / 2
    );
  }

  private moveToLeader() {
    this.logToConsole("Moved to leader");
    this.state = State.Leader;
    this.heartbeat();
  }

  private async moveToCandidate() {
    this.logToConsole("Moved to candidate");
    this.state = State.Candidate;
    this.currentTerm++;
    const result = await this.rpcRequestVote();
    if (result) {
      this.moveToLeader();
    } else {
      this.state = State.Follower;
      this.resetLeaderElectionTimeout();
      this.logToConsole("Moved back to follower");
    }
  }

  private async resetLeaderElectionTimeout() {
    if (this._leaderElectionTimeout) clearTimeout(this._leaderElectionTimeout);
    this._leaderElectionTimeout = setTimeout(() => {
      this.moveToCandidate();
    }, 1000 + Math.random() * 500);
  }

  private AppendEntries({
    term,
    leaderId,
    prevLogIndex,
    prevLogTerm,
    entries,
    leaderCommit,
  }: AppendEntriesParams): { term: number; success: boolean } {
    this.logToConsole("AppendEntries", entries);
    if (term === this.currentTerm && this.state === State.Candidate) {
      this.state = State.Follower;
    }

    this.resetLeaderElectionTimeout();

    if (term < this.currentTerm) {
      return { term: this.currentTerm, success: false };
    }

    if (
      !this.log[prevLogIndex] ||
      this.log[prevLogIndex].term !== prevLogTerm
    ) {
      return { term: this.currentTerm, success: false };
    }

    if (!entries.filter((e) => e.type !== LogType.Beat).length) {
      // simple heartbeat
      return { term: this.currentTerm, success: true };
    }

    this.log.push(...entries);
    this._store.apply(entries);
    this.commitIndex = Math.min(leaderCommit, this.log.length - 1);
    return { term: this.currentTerm, success: true };
  }

  private RequestVote({
    term,
    candidateId,
    lastLogIndex,
    lastLogTerm,
  }: RequestVoteParams): { term: number; voteGranted: boolean } {
    this.logToConsole(
      "RequestVote",
      term,
      this.currentTerm,
      candidateId,
      lastLogIndex,
      lastLogTerm,
      this.log.length - 1
    );

    if (term < this.currentTerm) {
      return { term: this.currentTerm, voteGranted: false };
    }

    const oldTerm = this.currentTerm;

    if (term > this.currentTerm) {
      this.currentTerm = term;
      this.state = State.Follower;
      if (this._leaderElectionTimeout)
        clearTimeout(this._leaderElectionTimeout);
    }

    if (
      !this.votedFor &&
      !(
        lastLogTerm > this.log[this.log.length - 1].term ||
        (lastLogTerm === this.log[this.log.length - 1].term &&
          lastLogIndex >= this.log.length - 1)
      )
    ) {
      return {
        term: this.currentTerm,
        voteGranted: false,
      };
    }

    if (this.votedFor && term === oldTerm) {
      return {
        term: this.currentTerm,
        voteGranted: false,
      };
    }

    this.votedFor = candidateId;

    return {
      term: this.currentTerm,
      voteGranted: true,
    };
  }
}
```

To simplify testing, the `src/cluster.ts` file provides an easy way to create a Raft cluster that also exposes the API for a distributed key-value store.

```ts
// src/cluster.ts

import { ChildProcess, fork } from "node:child_process";

export class RaftCluster {
  nodeProcesses: ChildProcess[] = [];

  constructor(nNodes: number = 3) {
    const serverPorts = new Array(nNodes).fill(0).map((_, i) => 5000 + i);
    const raftPorts = new Array(nNodes).fill(0).map((_, i) => 7000 + i);
    const raftAddresses = raftPorts.map((p) => `http://localhost:${p}`);
    console.log(serverPorts, raftAddresses);
    serverPorts.forEach((port, i) => {
      this.nodeProcesses.push(
        fork(
          "src/start-node.ts",
          [port.toString(), i.toString(), raftAddresses.join(",")],
          {
            execArgv: ["-r", "ts-node/register"],
            stdio: "inherit",
          }
        )
      );
    });
  }
}

new RaftCluster(Number(process.argv[2] || "3"));
```

To start the cluster, you'd run:

```bash
npm start
```

By default, the cluster starts with 3 nodes, and this can be adjusted by passing an argument:

```bash
npm start 4
```

You should logs as below:

```bash
➜  raft-node git:(main) ✗ npm start 4

> raft-node@1.0.0 start
> ts-node src/cluster.ts 4

[ 5000, 5001, 5002, 5003 ] [
  'http://localhost:7000',
  'http://localhost:7001',
  'http://localhost:7002',
  'http://localhost:7003'
]
5003 3 [
  { index: 0, address: 'http://localhost:7000', port: 7000 },
  { index: 1, address: 'http://localhost:7001', port: 7001 },
  { index: 2, address: 'http://localhost:7002', port: 7002 },
  { index: 3, address: 'http://localhost:7003', port: 7003 }
]
5000 0 [
  { index: 0, address: 'http://localhost:7000', port: 7000 },
  { index: 1, address: 'http://localhost:7001', port: 7001 },
  { index: 2, address: 'http://localhost:7002', port: 7002 },
  { index: 3, address: 'http://localhost:7003', port: 7003 }
]
5002 2 [
  { index: 0, address: 'http://localhost:7000', port: 7000 },
  { index: 1, address: 'http://localhost:7001', port: 7001 },
  { index: 2, address: 'http://localhost:7002', port: 7002 },
  { index: 3, address: 'http://localhost:7003', port: 7003 }
]
Node 3:  Started raft server
Node 0:  Started raft server
Node 3:  Started KV server
Node 0:  Started KV server
Node 2:  Started raft server
Node 2:  Started KV server
5001 1 [
  { index: 0, address: 'http://localhost:7000', port: 7000 },
  { index: 1, address: 'http://localhost:7001', port: 7001 },
  { index: 2, address: 'http://localhost:7002', port: 7002 },
  { index: 3, address: 'http://localhost:7003', port: 7003 }
]
Node 1:  Started raft server
Node 1:  Started KV server
Node 2:  Moved to candidate
Node 0:  RequestVote 1 2 0 0 0
Node 1:  RequestVote 1 2 0 0 0
Node 3:  RequestVote 1 2 0 0 0
Node 2:  rpcRequestVote [
  { term: 1, voteGranted: true },
  { term: 1, voteGranted: true },
  { term: 1, voteGranted: true }
]
Node 2:  Moved to leader
Node 0:  AppendEntries [ { type: 'Beat', args: [], index: 1, term: 1 } ]
Node 1:  AppendEntries [ { type: 'Beat', args: [], index: 1, term: 1 } ]
Node 3:  AppendEntries [ { type: 'Beat', args: [], index: 1, term: 1 } ]
Node 1:  AppendEntries [ { type: 'Beat', args: [], index: 1, term: 1 } ]
Node 3:  AppendEntries [ { type: 'Beat', args: [], index: 1, term: 1 } ]
```

---

## References

I extensively referred to the Raft paper itself and Phil Eaton's implementation in Go while writing mine.

- https://raft.github.io/raft.pdf
- https://notes.eatonphil.com/2023-05-25-raft.html
- https://thesecretlivesofdata.com/raft/
