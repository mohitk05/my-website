---
title: Notes - Concurrency in Thought
tags:
  - cognitive-science
date: 2024-03-29
description: Notes for milestone 3 of cognitive science paper
---
Core research question: Concurrency in human task processing - how do we think/process concurrently? Limitations of concurrency in humans? Computational model?

Self notes:
* Limits of multitasking depend on how many representationally-distinct pathways exist in the brain
* Recommended Structure: (target 10 pages)
	* Abstract: A short overview of your entire paper. (0.25 pages)
	* Introduction: Why is this research question important? (0.75 pages)
	* Experiment design: How did you examine the research question? Describe the process of conducting the literature review/experiment/models/tools. For the computational model/tool, you should also describe in detail about your model/tool and how you implemented them. (1 pages)
	* Results: What did you find through your study? (4 pages)
	* Discussion: What are the implications of your results? (2 pages)
	* Conclusion: Overview of results and discussion. (1 page)
	* Limitation: What is the limitation of your study? What could future study explore? (1 page)
* My structure
	* Introduction
	* Design - historical, evolution, limits of concurrency, future (expansion)
		* How does human brain process concurrent tasks?
		* What is historical context of this topic?
		* What are the limits of concurrency in human brains?
	* Results
		* History (1 page)
			* Single channel theory, biases, various models
			* Single processing unit
			* Shared-memory vs message-passing
		* Concurrency vs parallelism
		* Stroop test
		* Studies - list of studies done to find concurrency
		* Perception and action as two fundamental types of cognitive tasks
		* Cognitive function and motor function together, cognitive and cognitive together
		* Models - connectionist
			* Parallel information transmission
			* Working memory model vs connectionist
		* Differences from other mammals
		* Limits of concurrency
	* Discussion
		* AGI

https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.01366/full
* Researchers debate whether multitasking involves serial or parallel processing
* Serial processing due to limited resources causes severe performance costs
* Central cognitive processing in Task 2 can occur parallel to Task 1, challenging single-channel theories
* Backward crosstalk logic and locus of slack logic are used to demonstrate parallel processing
* Studies show evidence of central Task 2 processing during Task 1 bottleneck stage, supporting capacity sharing assumption
* The concept of crosstalk challenges single-channel theories and highlights the interaction between central processes in multitasking.
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4845905/
* Multiplexing, or the use of the same representations for different purposes, can introduce cross-talk among processing pathways
* The introduction of multiplexing decreases the number of tasks that can be executed at once
* The problem of mutual interference, or cross-talk, arises due to the multiplexing of representations; that is, the use of the same representations for different purposes — for example, the use of phonological representations for both encoding auditorily presented words, and for reading words out loud
https://journals.sagepub.com/doi/epdf/10.1080/00335557243000102
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2925295/
* Working memory is the small amount of information held in an easily retrievable state simultaneously
* Various models of working memory

https://www.sciencedirect.com/science/article/pii/S0732118X21000222
* research over the past 50 years has shown that serial-processing models are not an accurate account of human information processing
* Concurrency vs parallelism
* Shared-state model, message-passing
* Elementary information processes. Serial computing encouraged serial thought processing model
* We do have concurrency or parallelism otherwise motor functions would have interfered with higher-order cognition (thinking, decision making)
* Behavioural experiments can distinguish serial and concurrent processes
* Connectionist networks - parallel activation, parallel constraint satisfaction
* Shared state vs message passing - more message passing recently
https://www.cs.utexas.edu/~dana/Salvucci-PR08.pdf
* Concurrency as threaded cognition
* Various combination of activities produce different results
* The first implication of our theory of threaded cognition is that concurrent multitasking does not require supervisory or executive processes to manage and schedule multiple task processes.
* Shared-resource model

[Models of Central Capacity and Concurrency](https://pdf.sciencedirectassets.com/272579/1-s2.0-S0022249600X00727/1-s2.0-0022249684900014/main.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQCepNgIJ2bXH8JcQUbTUmSs9uaHsQZxFnfwvaDXs3JPvQIhAIMi3rs1gF0880RlFrqxC13JBKzJFJETD42RE48gtCNyKrwFCOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQBRoMMDU5MDAzNTQ2ODY1IgzXJ9kXES66CQ6x6B4qkAV3w9lFzlePQR2nDFJcXEzJjwSDp%2B9oG7cMydXkpUcKpwyOFs42v60MRm0I%2FTd6LWHUONBy44U4AKWlY4MamkTydWS5Nff4kRu203ElBWQEZ%2FDmMC4hibIlVBcV%2FVxWl4G5SrWaJIAfUbgKpWy%2Bsh8iqEm605scPwzBMJGABiiHk82ooamUJ7EQCuRhXG%2BUgRApo8SVUCnAk4RUNEg0HLJhWNxC90n3%2BlylOjFJmc1SdIK1YgGs4cAnj%2FPwXLN6R%2BhgkYN8YnWYBn3dMH%2BkjadDeBkXBNkor8y6%2BfvkG7gY8cUN3pvj6ewU8wuEU58gP07ZmevWNPblb%2BsLSpd24RQ22dfW1%2BJO7BQCGDlSFr6SdT1uH1gaRlcT%2F%2Fxxs79fKx0FwcFGuTThBma3BkgRMQxB8wNEJB65ZxK05ZxewShq8vyjZrvPA9wr1LgiYC%2BrKcU9dQbRcGt3aSF9lGRqTy4Ki563V%2B6ke9IZcnNiOLPBx08wYi%2F93SHiS0DqnsBA72Xm65xPiUW231CYI9vExJMNZiYytnb%2FaPTrtpW7YO2BpaKyA9CNRlLoS6zrFUWFsc3LLWoNIa9%2Bt8Hip%2BGaXHB2jN4zR1N4bL0uzV0Tp3NcDWmfjd5rQ8yeH%2F8DJnuPbDBGoFtwEiY%2BrTkKFKz662N3nGv94oFlZ7W%2BVBGKSlAANa0o492BrtCXe74zgdJ%2BJOMEvInUb6KzrB7gjSREG8BAtQuHiP9alvpvDlu6ZD9mS9xAbABdEmwHISHt28Pp1A%2F2t%2B2aGZBg%2BdALgaS2UbaGLlbTT52LiWLICXLuqgBP%2BNr9VPEYewfS64lw423n91JdwKiBhZ8Bi%2BAR8hAsBfcpVudT1fXsR9jm%2BEVvkVy%2FXTCvrJqwBjqwAVNYBCmCIorEUrRNmPjqZ6tJM%2FVWBplc7mpK3g4caSx7pxiFqzwPeZI1tmYO6BD0cVTVTEiHMzWWfggNT45Tiujdizp4hDBqOO%2F8RK5CTEh4J9JlY%2BwM7BC%2F14Fe7VeP2A5nXU5eGB7OESuBZkRbFFoG3ybzYrrgsqlIJAOwJMucsyZauav%2FBFltr1t0II9YtoKJdVS2aIRob5nsKuTYvzNhIxkmXIZzMzXUVVtLs3h3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240329T113209Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIAQ3PHCVTYVYFAUOVS%2F20240329%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=4e837c5655a654255fbecf5b240bebe060204e2ba47e3f0b4f61a09344eff06a&hash=2e069d8e752a72aed0d8e8ca1e0c8de8e397a8c66265f7e1b8c6b018100e7172&host=68042c943591013ac2b2430a89b270f6af2c76d8dfd086a07176afe7c76c2c61&pii=0022249684900014&tid=spdf-be8cd021-8331-4764-bd58-262c79feb69b&sid=58ee81dc239b724d90280266d96c3e3c1dadgxrqa&type=client&tsoh=d3d3LnNjaWVuY2VkaXJlY3QuY29t&ua=0a045a5204095f5c06&rr=86bf89a6bc4b2681&cc=de)
* Single Channel Theory - old theory that says humans can process tasks in serial. Derived from then computers which were serial.
* Complex theories eveloped from von Neumann computer arch - several sensory inputs, one central processing operating one task at a time, outputs sent to peripherals, performed simultaneously.
* Concurrency in central mechanism:
	* Kahneman's theory - a limit on central capacity - various ways to assign this limit concurrently (total capacity increases as demand of concurrent processes increases.)
	* McLeod - fixed capacity - assigned as per the difficulty of the task
	* Multiprocessing vs timesharing: 

https://journals.sagepub.com/doi/epub/10.1111/j.1467-9280.1990.tb00067.x
* Behavioural experiments that show concurrency

https://www.nature.com/articles/s41467-023-43971-z
* Gap between parallel information transmission in humans and other mammals

https://en.wikipedia.org/wiki/Stroop_effect
* Stroop effect - used to test performance of 

https://link.springer.com/article/10.1007/s00221-010-2429-6
* dual task effect (DTE)

http://www.isle.org/~langley/papers/icarus.csr17.pdf
* ICARUS cognitive architecture
	* 
* https://escholarship.org/uc/item/7542d3cm (concurrency in ICARUS)

https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.907121/full#B3
* Visual working memory concurrenytc

https://onlinelibrary.wiley.com/doi/pdf/10.1207/s15516709cog0000_12
* Concurrent Cognitive Task Modulates Coordination Dynamics

https://link.springer.com/article/10.1007/s10462-018-9646-y#Sec2
* Review of major cognitive architectures