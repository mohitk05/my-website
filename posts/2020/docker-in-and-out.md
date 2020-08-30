---
title: Docker In and Out 🐳
date: 2020-08-29
coverImage:
topics: ['devops', 'docker']
description: I have been doing a bit of DevOps lately. Honestly, I have had a love for it from the beginning, playing with R-Pis and using them as home-servers. Right now we are at the peak of virtualization and rarely would an app be deployed to a physical server. Docker is one such important piece in this.
---

Quite recently I got a chance to work on the DevOps side of things at work, and I have been enjoying it a lot. I had a general idea of what Docker was, but I wanted to know more<!-- excerpt --> about it. So I decided to get into reading mode and gather as much information around Docker as possible and get to know things better. This post will kind of act as a collection of my notes and also of my thoughts that wander randomly.

---

## Docker In One Line

> Docker is a tool that lets you ship your software without having to care about the infrastructure it is going to run on.

Let's consider an example, something that I experienced recently and would rightly justify Docker's use-case. You are a part of a frontend team that works on a platform that consists of 3 different applications. One of them is a Nodejs API server, another a frontend application, and the remaining one a server-side rendered app. These can essentially be anything, each running on Node.

Since all of these 3 apps were up and running for a considerable amount of time, you rarely touched the deployment part of the whole setup and relied on an executor like Jenkins to build and deploy your apps.

Now consider that due to a recent feature request, there is a requirement for another app to be built which would handle a particular set of requests. You start with basic code setup, add the necessary configuration files, and set up a Jenkins job for the application. On running the job, it fails, throwing a random error related to some TypeScript package failing to execute. Having no idea what went wrong, you search for the error message on the internet and the first StackOverflow answer suggests that your Node version is an older one and you would have to update it to 3 major versions up. Great.

Updating your Node version on the Jenkins executors would mean that it might break other builds which depend on that version of Node, causing chaos. You think, should you run this on a separate instance which has an updated version of Node? And then your colleague suggests using Docker, the easy solution for this problem! Turns out the Jenkins server already has Docker installed and you just have to change the build scripts and add a Dockerfile to the repo and the build starts working perfectly.

> **TL;DR** Your deployment setup uses a particular version of Node, and you build a new app requiring a newer Node version, Docker would be a tool to isolate tooling from the infrastructure and deploy without caring about what Node version is installed on the host machine.

This not only solves your immediate problem, but if in the future you had to deploy your app anywhere else and it had Docker installed, which is very probable, you wouldn't have to change anything and everything would work as it did on your build server.

## Behind the Scenes

I am going through Frontend Master's course [Complete Intro to Containers](https://btholt.github.io/complete-intro-to-containers) by Brian Holt, where he amazingly explains what Docker is under the hood and then talks about it as a tool. Essentially, Docker uses a combination of OS features to isolate environments and limit resource division in terms of `containers`. The first important tool is `chroot`.

Before attempting to run any commands, it is better to have a Linux environment set up. If you are on Linux already then well and good, but if you are not, you may use a virtual machine. But, since Docker can containerize anything, you can run Ubuntu inside Docker! After downloading and installing the respective Docker version for your OS, you can run the following command

```bash
docker run -it --name docker-host --rm --privileged ubuntu:bionic
```

This will download Ubuntu bionic version and start bash in an interactive mode so that you can type in commands. Voila ✨

## `chroot`

This particular command in Linux is used to `ch`ange `root` to run process from a different root than the default one. When this is run with a directory path and a process, the process runs wrt to the path as the root, given the new root has all the files to run the process. To see this working, we would have to move certain files and libraries from our OS file structure to the new root. The most basic ones to start with would be `bash` and `ls` to test running a command.

Files to be moved would include the respective binaries and their dependencies. Brian has compiled all the commands to be run on the [course website](https://btholt.github.io/complete-intro-to-containers/chroot), one may refer those to move the required files to the new root. Once this is done, run

```bash
# Consider we made a new root in the directory named 'new-root'
chroot new-root bash
```

This should start bash with the root as the `new-root` directory. This can be considered as the first step towards containerization where we have created a pseudo environment which can then be used to load a complete OS or some application.

One important thing which remains unsolved with `chroot` is the child to parent accessibility. With the above setup, the process running inside the new root will still have visibility of the processes being run by the parent process, which is the Ubuntu OS in this case. This is not the ideal case as containers should have no access and context to anything outside themselves. Enter `unshare`.

## `unshare`

This is a way to tell `chroot` to not share certain things with the new root while running a process with a new root. `unshare` creates isolated namespaces from the parent so that every new process has no idea about any other running processes.

`unshare` and `chroot` combined give us the capability to create and run isolated processes, our own _containers_. All of this is a part of what Docker does under the hood.

The next important thing that is needed to be taken care of is resource management. When several independent processes run on the same machine, the distribution of resources like memory and CPU needs to be managed well or certain processes might hog on to most of the resources and result in affecting the others.

To do this, we would use something called `cgroups` which was built at Google.

## `cgroups`

This lets us limit a certain amount of resources to a particular environment that we can define. Then we can add our processes to these environments so that their resources remain under check by the rules set for that environment by `cgroups`. One can find the commands to create and use `cgroup`s on the [course page](https://btholt.github.io/complete-intro-to-containers/cgroups).

---

Now that we have a fresh root, namespace isolation and resource limits, we can safely run any process inside this setup. Docker abstracts all of this and much more like networking (port mappings, etc.) and providing a CLI for these operations and hence becomes a packaged tool to confidently deploy and ship applications.

## Using Docker

Docker uses the concept of images to store a zipped version of a particular setup. If we consider the overall process, it looks largely like this

```bash
 ------------  docker build  --------------  docker run  ------------------
| Dockerfile | -----------> | Docker Image | ---------> | Docker Container |
 ------------                --------------              ------------------
```

To make an app deployable on Docker, one would have to simply add a Dockerfile at the root of the project with suitable instructions to get the app running. You can base your app image on some other ready-made image e.g. while running a Node app, you can use Node's Docker image and run your app on top of it. Since you would mention this and the Node version to get in your Dockerfile, wherever you run the app (using Docker), it would always pull the same Node version.

Usually, to support the sharing of pre-built images, we have a public repository where one can find various images and can also add their custom images. Docker provides such a repository called Docker Hub. It is very similar to the npm registry in the JS ecosystem. Since all of this is open source, you can create your private repository if you do not wish to share your images. AWS provides exactly this in the form of ECR.

ECR (Elastic Container Repository) is a managed place to add all your Docker images so that they can be pulled by various Docker hosts that deploy your containers. ECS (Elastic Container Service) is the service from AWS to manage your containers and group them in the form of logical clusters so that similar apps are placed and can be monitored/handled together.

---

Docker, to me, is an excellent example of **build once, deploy anywhere** (rather 'x once, y anywhere') philosophy. It is similar to the JVM model, or the WebAssembly model, which provide an intermediate target to build or convert to that is accepted by either most of the platforms, or by one platform that can be installed everywhere. It is the `bytecode` in the case of JVM and the `.wasm` output for WebAssembly.

Software amazes you each time you look at it from a different perspective.
