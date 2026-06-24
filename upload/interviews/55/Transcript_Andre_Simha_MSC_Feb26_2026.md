# Interview Transcript — André Simha, Chief Digital & Information Officer (outgoing), MSC
**Date:** February 26, 2026  
**Format:** Video call  
**Interviewer:** Mahmoud Kiasari, PhD Candidate, Dalhousie University  
**Programme:** Lab2Market (MITACS)  
**Folder:** Interviews/55

---

## Full Transcript

**Speaker 1 (André Simha) | Speaker 2 (Mahmoud Kiasari)**

---

**Speaker 2 (04:11)**
Thank you. Thank you very much. Really appreciate being here.

**Speaker 2 (04:13)**
I mean I was going to send you an email. I think you'll forget about that. But yeah, I was going to.

**Speaker 1 (04:18)**
Now when I can't forget, but you know, we go from one meeting to another.

**Speaker 2 (04:26)**
I appreciate that, makes sense. Okay. So as I know, your schedule is busy — let me just start the meeting itself. As I just mentioned in the email, my name is Mahmoud, doing my PhD at Dalhousie University Canada, and around 2 years ago I was working with a company — three different team company actually — that we came up with an idea about building an ecosystem between different entities that would help oil and gas industries. Recently, I was accepted in the programme called Lab2Market, and in this programme we have to talk with at least 100 people to get their ideas related to some kind of project — because right now it's just a rough project, I'm still working on it. So throughout this programme, I have to talk with people to get knowledge, especially in your case, which is a super fantastic opportunity for me. If you let me, I would like to talk about my idea at the end, because the procedure is: I ask a couple of prepared questions, and at the end I'll share the whole idea. Is that okay? Could you just introduce yourself a little bit?

**Speaker 1 (05:38)**
I'm Andrew. I've been at MSC for... I started my career in trading — nothing to do with tech — but trading was difficult without a system to help. So I started to write software, and slowly slowly you end up doing a whole bunch of things. I ended up at MSC about 38 years ago. And essentially I started the tech — there were no computers when I joined. MSC was a small company, and today we are at the size we are with. I transitioned from a role of pure technology to more of a digital and total leadership role, also a lot of industry projects, essentially a lot of collaboration between carriers, trying to bring people together to do things together. To make the industry better. We haven't succeeded yet. But we're working.

**Speaker 2 (06:48)**
I really liked your last post — congratulations by the way, because you're moving on.

**Speaker 1 (06:55)**
Yeah, I'm slowing down.

**Speaker 2 (06:58)**
That last post was fantastic. Especially when you were talking about starting as a small company around 40 years ago — right now MSC has more than 200,000 people. That's really fantastic. And I really appreciate your ideas about digitalisation, because as you just mentioned, from the perspective of someone looking for new ways — my platform is actually at that stage. I'm trying to find new ways to help supply chain management. So thank you very much for the introduction. If you don't mind, I'll start with the questions.

---

### Q1 — Spare Part Supply Chain at MSC

**Speaker 2 (07:59)**
MSC is a very big company — you operate more than 500 vessels across many ports globally. Obviously, something on those ships needs replacement every day — parts, valves, you name it. From your 40 years at MSC, what does the spare part supply chain actually look like operationally? Is it centralised globally, managed by agents, networked, or effectively improvised ship by ship?

**Speaker 1 (08:28)**
Look, I don't really get involved in that. But I know there are two aspects. One of them is the procurement aspect, which is centralised. We have a ship management office in Cyprus that takes care of both spare parts and crewing. You can imagine there's a lot of crew for all these ships. Then, of course, there's the distribution. But the fact that you have ships means it's relatively easy to keep spare parts on some ships, and depending on which ships you can feed other ships when you meet in transshipment ports. A lot of the ships are the same class — you know, like you'd have a Boeing 747-400 — you have quite a few ships that are the same, therefore some of the parts are the same. But yes, the process is centralised and they use various platforms for that. There's competition between different providers. But yes, that's what I know. I'm not involved so much in the marine side.

---

### Q2 — Blockchain and Digital Supply Chain (DCSA)

**Speaker 2 (09:46)**
About the blockchain and DCSA — you've been driving standardisation for years. In practice, what did MSC actually pilot or deploy in digital supply chain, and what's your honest assessment?

**Speaker 1 (10:13)**
Well, I was one of the founders of DCSA. I got together with some of the other carriers — we've known each other for a long time — and we started standardising in the late 2000s, when we created INTO, which was one of the first e-business platforms. We had to create standards. It all came from a push from customers — late-90s customers wanted to get container events: my container has been loaded, discharged, and so on. But we were often having to connect with customers and customise messages. Customising messages, especially EDI messages, is a pain in the neck because you lose a lot of time testing back and forth. So the first thing we did with DCSA was look at what the landscape looked like — key things that need to be relayed between carriers, customers, customs authorities and other regulators — and we started working on standards, but we immediately focused on APIs rather than EDI because APIs are much quicker to get across.

Then, on the Blockchain side, MSC just before COVID was looking at ways of visualising certain documents — we're in a business with a pile of documents per shipment. We started looking at digitising the bill of lading, which is the key document and title of property, and the most complex one because it goes into customs and banks. That's why we started using blockchain. We first tried to do it ourselves, but it was difficult — in the blockchain world you don't necessarily have interoperability. So we used a company called WaveBL to help us implement that. At the same time in 2018–2019, we were working with other carriers on an ecosystem platform called TradeLens (IBM version), also using blockchain, essentially as a guarantee of a single version of one document. The data was still in regular databases, but we needed the blockchain especially for the bill of lading — to make sure that document could only exist once. I'm not saying it was only thanks to blockchain; there are other methods to guarantee the source of a document, but at the time it was fashionable.

---

### Q3 — IoT and Predictive Maintenance

**Speaker 2 (13:51)**
You've been an early adopter of tracking containers and ship IoT — sensor data should let you forecast failures and stage the right spare part next to the right port. In practice, has MSC implemented that kind of prediction-to-supply pipeline, or is it still a concept?

**Speaker 1 (14:23)**
For IoT, we had two aspects. The first was making containers smarter — looking at integrity and security: once the doors are closed and sealed, have they been opened when they shouldn't have been? We also know where the container is, but that's less interesting because we know through data feeds anyway. The second IoT focus was on ships — using sensors to give us engine parameters, fuel consumption, emissions, all important for us as a ship owner, but also for predictive maintenance.

But it's still early days. With IoT, like with many solutions, you get a lot of data. And that's when it becomes difficult — how do you manage and use all that data? People still use Excel, unfortunately. When you want to make good use of data, theoretically it's easy, but in reality it's difficult to change the way people work — to work by exception rather than just looking at a huge bunch of reports and dashboards. We probably have 200–300 ships that are reporting, but I think building the systems behind that is the part that's quite difficult for the whole industry.

---

### Q4 — AI and Data Quality

**Speaker 2 (16:47)**
Since you mentioned IoT and the data challenge — have you considered using any new technology beyond AI and machine learning? Maybe other technologies?

**Speaker 1 (17:01)**
I think AI can certainly help in the future. The big problem is that we don't have good data. The quality of the data overall — not necessarily the sensors on ships, but overall — the quality of data in our industry is very poor. A lot of people come and say "we have a bunch of AI solutions for your platform." I say, yeah, that's very cool, but the quality of the information we have is poor. If you use AI, ML, or other tech on bad data, you're not going to get anything useful. I think we all need to focus today on improving the quality of the information, and then you can start throwing new tech onto it. Otherwise it's too ambitious — that's my personal opinion.

**Speaker 2 (18:12)**
When you talk about the quality of data — what do you think the issue is? What causes poor data?

**Speaker 1 (18:34)**
It's quite simple. If you look at supply chain — we are the shipping side, but we also do trucking and railing. We use a lot of third parties. We're not always the owner of the trucks. We're not DHL. If you take DHL or UPS or FedEx, these guys have more of their own assets, which is how they can guarantee a parcel in 24 hours. But we are dealing with ports, terminals, trucking companies, rail operators, barge operators — a lot of the data we get comes from these third parties. That was my idea behind smart containers: instead of waiting for my terminal to tell me the container's been discharged or moved, I want to know it myself. But to do that, you have to equip millions of containers with the right device and process billions of data elements. The problem is really the third parties — you cannot count on the information they give you, and it's often not real-time. A vessel discharge can take 3–4 days, so you don't know exactly if a container was discharged Wednesday vs. Thursday.

---

### Q5 — OEMs and Digital Inventory / Additive Manufacturing IP

**Speaker 2 (20:26)**
My next question is about OEMs. When we talk about digital inventory, one aspect is 3D printing. We'd encourage companies to shift toward digital inventories rather than only physical. But to do so, we need OEM trust around blueprints and IP. Have you dealt with OEMs and how conservative they are about their IP?

**Speaker 1 (21:26)**
That's a good question, but honestly it's something I don't have enough experience to answer well. I think it's one of those technologies that makes a lot of sense. I remember working with a friend who was the head of supply chain at a well-known company — they went from producing everything in China and bringing it to Europe, to a model where you could order the part you wanted in Europe and it would be made for you there. They were moving the raw material rather than the finished product. I think there is something there in 3D printing — the fact that you can produce what you need where you need it, rather than making it in China and flying it all over the world. On the other hand, you still have to bring the raw material. But yeah, I'm not really familiar with the OEM IP side, honestly.

---

### Q6 — Change Management & What Actually Drives Adoption

**Speaker 2 (22:31)**
Your last LinkedIn post said: "It's not so much about technology itself — it's about the people, the mindset shifts, and the moments that shape progress." You spent around 40 years trying to digitalise one of the most traditional industries in the world. For someone building a new digital platform in maritime supply chain — what's the honest lesson about what actually changes behaviour? What makes shipping companies adopt smart technology?

**Speaker 1 (23:21)**
Two things. First, it depends on the generation of the people you talk to. Younger generation: "it's cool." Old guys like me: afraid. What I've seen in the efforts we've tried over the past years is two problems getting people into an ecosystem.

The first, and most important, was **trust**. The reason: we had situations like IBM with TradeLens and Maersk — they created that platform together. So at the beginning people were saying, "wait, you've got IBM (not the fastest or cheapest) and you have another carrier." There was a real lack of trust, and I think that's where we lost it.

The second is **what's in it for me**. People didn't understand why we were doing certain things. You have to put yourself on the customer side — the shipper. If you need to manufacture something, you want to pick up the container and get it to your factory. In our industry, people sometimes didn't understand the importance of what they were moving — we didn't explain it well enough.

So: make sure everyone understands what's in it for them (the "why" over the "how" and "what"), and then build trust — make sure whatever data is in the system is well-segregated, security is done properly. Segregation is difficult too: a normal shipping transaction can have 20 parties involved. How do you make sure each party only sees what they're supposed to see? That kind of problem killed some of the products.

---

### Closing — Mahmoud's Pitch & Referrals

**Speaker 2 (26:28)**
Thank you very much. That was one of the best meetings I've had — I've had around 50, and this was one of the best.

The idea we're trying to develop is building an ecosystem between different entities, built around **additive manufacturing and 3D printing** — clients, 3D printing facilities, spare parts providers, OEMs, and crucially, regulations. We recently also found that you can't talk about additive manufacturing without talking about **digital inventory**, and digital inventory means touching the **supply chain** side — especially after COVID. Something changed. People are rethinking supply chains — what if COVID happened again? What if tariffs hit? We're trying to think ahead. Any last advice?

**Speaker 1 (28:24)**
I wish I had a simple answer. What I think is: you need to be able to explain the **why**. That's critical. Show people how they can benefit — why it's better than what they do today. After COVID, people realised you can't always count on China or India to get your stuff. Canada is a good example — when tariffs hit, all of a sudden you're paying double for imports. If companies can be more independent in how they source goods, you solve two problems: supply chain resilience and cost. And **sustainability** is also very important — if you can manufacture something on demand (digital-first), you have a really good story. The question is whether you're cost-competitive vs. importing. But with tariffs and uncertainty, who knows what tomorrow looks like.

**Speaker 2 (30:23)**
Two final requests: first, if you know anyone I could speak to about this side of supply chain, introductions would be very helpful. Second, could I reach out to you again in a month or two for another 15–20 minutes?

**Speaker 1 (31:22)**
For me, use LinkedIn because my email is going to change. Ping me on LinkedIn — no problem.

**Speaker 2 (31:29)**
Thank you very much. Really appreciate your time.

**Speaker 1 (31:32)**
Glad. Yeah. Yeah.

---

*End of transcript.*
