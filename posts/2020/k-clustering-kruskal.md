---
title: k-clustering and Kruskal's Algorithm
date: 2020-12-27
description: Notes about Kruskal's MST algorithm and its application in k-clustering
topics: ['Algorithms Part 3']
---

I am currently on the 3rd course of the Algorithms specialization on Coursera and this part is all about greedy algorithms. One of the popular greedy algorithms is Kruskal's. It is a way to find the minimum spanning tree (MST) of an undirectied graph. MST of a graph is defined as a spanning tree, i.e. an acyclic graph that spans over every vertex of the graph and is minimum in cost.

This concept is applicable in several interesting areas such as networking - finding two nodes in a network graph, and clustering - grouping similar objects together. Another similar algorithm is Prim's, which operates on vertices unlike Kruskal's, which operates on edges of a graph.

The input for Kruskal's algorithm is an undirected graph _G(V, E)_, where _V_ and _E_ denote the number of vertices and edges respectively. The output exptected is a minimum spanning tree _T_ that includes all the edges that span across the graph _G_ and have _least total cost_.

Pseudocode for Kruskal's can be written as follows:

```
Kruskal G:
    - Sort edges in ascending order wrt. edge lengths
    - T = empty
    - for i = 1 to m:
        - let e = E[i]
        - If e does not make cycles in T:
        - Add e to T
```

Trivially, the running time for this algorithm would be _O(m + n)_, _m_ being the number of edges and _n_ being the number of vertices in _G_. This is because there is one `for` loop of size `m` and the step for checking if there are cycles in _T_ takes _O(n)_ time.

As Tim Roughgarden frequently reminds what an algorithm designer should ask themselves - **Can I do better?** And the answer usually is yes. For Kruskal's algorithm, speedup is possible in the step where cycle existence is checked. To overcome the _O(n)_ time for this step, a data structure called **Union-Find** is used.

Union-Find structure stores objects in the form of disjoint sets, i.e. it holds a particular number of sets which have objects in them. And it provides two operations:

-   FIND(X): Given a value X, it can tell which set/group X belongs to.
-   UNION(S1, S2): Given two values S1 and S2, it can make a union set from the two individual sets.

These two properties can be well applied to Kruskal's algorithm. At the beginning, every vertex of _G_ would denote one set in Union-Find. As we go on adding edges to _T_, we go on fusing many vertices into one union set and the sets become the strongly connected components of _T_. This is a UNION operation on Union-Find, achieved in _O(1)_ time.

Secondly, to check whether an edge forms a cycle in _T_, we would have to check if the two endpoints of the edge are present in any same set of Union-Find. This can be done in _O(1)_ time by using the FIND operation which returns the name of the set to which an object (here vertex) belongs.

Usage of Union-Find improves the overall time complexity of Kruskal's algorithm to _O(mlogn)_. This is because we can think the process of edges getting added to _T_ in terms of what happens with the vertices. Since Union-Find operations are done constant time, we need to find the number of times these are performed.

A union is done when two sets are to be merged, and when this happens, the size of the resultant combined set is atleast the double of initial set sizes. This is because when two sets merge, the set with smaller number of objects has to update the set name (or leader) for all of its members to that of the larger set. After this is done, all the member would point to the larger set name and could be _found_ in the larger set.

This eventually means that at each union, the size of sets go on doubling up. This is familiar logarithmic pattern, and is ruled by the number of vertices, as they are grouped in the sets. Hence we can say that the union operation happens _log(n)_ times, and the overall time complexity for Kruskal's algorithm with Union-Find becomes _O(mlogn)_.

#### Application in Clustering

Clustering is the process of grouping _similar_ objects into clusters. Similarity is defined by some measure, e.g. a characteristic distance. Given a set of nodes and their distances with each other, clustering can group the closest nodes into _k_ clusters. Some examples include clustering images that respresent an object, grouping similar webpages, etc.

The pseudocode for this algorithm looks as follows:

```
k-clustering P, k:
    - Each point in P is a single cluster
    - while # of clusters != k:
        - let p, q = closest pair of separated points
        - Merge clusters of p and q into a single cluster
```

If seen carefully, this algorithm is very similar to that of Kruskal's MST. The vertices in Kruskal are points here, the edge costs there are distances here and edges are the segments joining p and q. The only difference is that instead of running for all vertices of the graph, clustering aborts when the number of clusters (or sets) becomes equal to _k_.

When the number of clusters becomes _k_, the minimum of the distances between two clusters is called the **spacing** of the clustering. Clustering is an important application in machine learning classification algorithms where similar data is clustered and classified into groups. One such example is image recognition, where the difference between two pixels can be defined as a function of individual RGB values, and then pixels having such a distance lower than a threshold can be clustered together.
