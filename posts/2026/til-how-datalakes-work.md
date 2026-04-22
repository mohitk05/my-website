---
title: "TIL: About internals of datalakes and distributed SQL execution engines"
description: Learnings from the Dremel paper from Google
tags:
  - til
  - databases
  - sql
date: 2026-04-21
---
Today, we discussed [Dremel](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/36632.pdf) at the Engineering Papers Guild and Joao very nicely summarised the paper. I learned many things, or rather the discussion clarified many things for me - specifically around _datalakes_, as Dremel was one of the the first attempts at doing what datalakes do today and it eventually was made available as Google BigQuery, a fully managed data warehouse with a SQL engine.

Essentially, datalakes are just huge collection of files with data stored in a particular format, e.g. Capacitor in Dremel based on Protobuf schemas at Google, and other formats like Parquet or at times JSON. Dremel is a **distributed SQL engine** that implements the SQL interface over structured data located in files. This is called _in situ analysis_ - i.e. you perform queries on data where it is and do not load it into a particular system (like you'd have to do in Postgres).

![datalake.png](/img/posts/datalake.png)

The data is written by other entities, e.g. by event streams, applications, batch jobs - but is available to query from via an SQL interface. The structured aspect of this data is possible due to data schemas and a catalog of this schemas and kinds of data available. The SQL engine refers to these formats when reading data from sources like Google File System (GFS) in Dremel, or AWS S3 or other data sources.

There are similar engines: [Presto](https://dzone.com/refcardz/getting-started-with-prestodb)/[Trino](https://trino.io/), Databricks has their own, Apache Spark SQL. The SQL part is more of an _interface_ here and the meatier part is the implementation of the execution engine. Relational databases also implement this engine, but more locally. A query pipeline would pass data in memory following a tree structure - collecting data from leaf nodes and then applying aggregations and filters as the query is resolved.

It would be fun to build a toy SQL query execution engine - if fact I did build a small version for my databases class in OMSCS, but I'd love to redo it.