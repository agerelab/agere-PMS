# PRD — AI Agent for Project Management System
**Version:** 1.0  
**Status:** Draft for Implementation  
**Product Area:** AI / Project Management  
**Primary Platform:** Web  
**Frontend:** Next.js  
**Backend:** NestJS  
**Deployment:** Vercel  
**Repository / CI:** GitHub  
**Development Environment:** Antigravity IDE

---

# 1. Executive Summary

Product Management System akan memiliki fitur **AI Agent** yang memungkinkan user membuat AI worker secara sederhana menggunakan natural language.

Agent dapat memahami konteks workspace/project, menggunakan reusable skills, memanggil tools yang tersedia, lalu menjalankan pekerjaan dengan permission yang diberikan.

MVP Agent memiliki tiga kemampuan utama:

1. **Membuat Ticket**
2. **Membuat Doc**
3. **Membalas pertanyaan di Chat**

Pengalaman membuat Agent harus terasa seperti perpaduan:

- **Claude** → natural-language interaction
- **ClickUp** → project context, tasks, docs, chat, dan execution
- **Automation** → trigger dan execution
- **AI workforce** → persistent digital teammate

Prinsip utama:

> **Natural language on the surface. Structured configuration underneath.**

---

# 2. Problem Statement

Project Management System tradisional mengharuskan user melakukan banyak pekerjaan manual:

- Membuat ticket dari hasil diskusi.
- Membuat dokumentasi dari informasi yang sudah ada.
- Menjawab pertanyaan yang sebenarnya bisa dijawab dari data project.
- Mencari informasi lintas task, docs, project, dan chat.
- Mengulang pekerjaan administratif yang sama.

Masalah utama bukan sekadar kurangnya automation.

Masalah utamanya adalah:

> User memiliki konteks di banyak tempat, tetapi belum memiliki worker yang dapat memahami konteks tersebut dan melakukan pekerjaan atas nama mereka.

---

# 3. Product Vision

Membangun AI Agent yang berfungsi sebagai **digital teammate** di dalam Project Management System.

Agent harus mampu:

```text
Observe
   ↓
Understand
   ↓
Reason
   ↓
Act
   ↓
Explain
```

Namun authority agent selalu dibatasi oleh:

```text
Permissions
+
Guardrails
+
Human Approval
```

---

# 4. Product Definition

## 4.1 Assistant

AI yang merespons ketika user bertanya.

```text
User → AI → Response
```

## 4.2 Agent

AI worker yang memiliki:

- Identity
- Goal
- Context
- Skills
- Tools
- Trigger
- Permissions
- Guardrails
- Intelligence Level

dan dapat bekerja secara persistent.

```text
Environment
    ↓
Agent
    ↓
Observe
    ↓
Reason
    ↓
Act
```

---

# 5. Core Product Model

Arsitektur konseptual:

```text
Agent
  ↓
Skills
  ↓
Tools
  ↓
PMS Data / Actions
```

### Agent

Composition dari objective, behavior, permissions, skills, dan trigger.

### Skill

Kemampuan reusable yang dapat digunakan oleh banyak Agent.

Contoh:

- Understand Project Context
- Generate Ticket
- Generate Documentation
- Answer Project Questions
- Summarize Discussion
- Analyze Tasks

### Tool

Operasi teknis yang dapat dipanggil Agent.

Contoh:

- `get_project`
- `get_tasks`
- `search_docs`
- `search_chat`
- `create_ticket`
- `create_doc`
- `send_chat_reply`

### Permission

Menentukan apa yang boleh dilakukan Agent.

### Intelligence

Menentukan tingkat reasoning/context/tool complexity yang dapat digunakan.

---

# 6. Goals

## Primary Goals

1. User dapat membuat Agent dalam waktu kurang dari beberapa menit.
2. User tidak perlu memahami prompt engineering.
3. Agent dapat memahami konteks PMS.
4. Agent dapat membuat Ticket.
5. Agent dapat membuat Doc.
6. Agent dapat menjawab pertanyaan melalui Chat.
7. User dapat mengontrol permission dan autonomy.
8. Semua execution dapat dilacak.
9. AI tidak melakukan perubahan berisiko tanpa authorization.
10. Architecture memungkinkan model AI diganti tanpa mengubah Agent.

## Secondary Goals

- Reusable Skill Library.
- Agent templates.
- AI usage metering.
- Intelligence tiers.
- Approval workflow.
- Agent activity log.

---

# 7. Non-Goals — MVP

MVP tidak mencakup:

- Multi-agent collaboration.
- Marketplace skill publik.
- Custom skill builder untuk end user.
- Autonomous deletion.
- Autonomous financial action.
- Autonomous deadline changes.
- Autonomous member removal.
- Complex visual workflow builder.
- External SaaS actions.
- Voice Agent.

Fokus MVP adalah:

> **Understand → Create → Respond**

---

# 8. Target Users

## Primary

### Project Manager

Membutuhkan bantuan untuk:

- Membuat ticket.
- Menyusun dokumentasi.
- Mendapatkan jawaban dari project context.
- Mengurangi pekerjaan administratif.

### Team Lead

Membutuhkan:

- Project status.
- Ticket creation.
- Documentation.
- Chat assistance.

### Team Member

Membutuhkan:

- Tanya jawab project.
- Membuat ticket dari chat.
- Membuat dokumentasi dari hasil kerja.

## Secondary

- Product Manager
- Engineering Manager
- Operations
- Executive / stakeholder

---

# 9. Core Use Cases

## UC-01 — Create Ticket

User:

> “Buat ticket untuk memperbaiki login timeout di mobile.”

Agent:

1. Memahami request.
2. Mencari context terkait jika diperlukan.
3. Menentukan informasi yang tersedia.
4. Mengidentifikasi informasi yang missing.
5. Membuat draft ticket.
6. Meminta approval bila policy workspace mengharuskan.
7. Create ticket.

Output:

```text
Ticket created

Title:
Fix mobile login timeout

Description:
Users are experiencing timeout during mobile login.

Project:
Mobile App

Priority:
Medium

Created by:
Project Agent
```

---

# 10. UC-02 — Create Doc

User:

> “Buatkan project decision document dari diskusi kita tentang authentication.”

Agent mencari:

- Chat
- Existing docs
- Related tickets
- Project context

Kemudian membuat:

```text
Authentication Decision Record

Context
...

Decision
...

Alternatives
...

Consequences
...

Open Questions
...
```

Agent **tidak boleh mengarang fakta** apabila tidak ditemukan dalam context.

Jika evidence tidak cukup:

> “I found the discussion, but I could not confirm the final decision. I can create a draft marked as unresolved.”

---

# 11. UC-03 — Reply Chat

User bertanya di project chat:

> “Kenapa ticket API integration belum selesai?”

Agent:

1. Search related tickets.
2. Check status.
3. Check dependencies.
4. Check recent relevant chat.
5. Generate response.
6. Include evidence/context.
7. Send reply berdasarkan permission.

Contoh:

```text
The API integration ticket is still open because
the authentication dependency has not been completed.

Current status:
• API integration: In Progress
• Authentication: Blocked
• Dependency: Authentication API

Last update:
2 hours ago
```

---

# 12. UX Principle

Agent creation harus menghindari form kompleks.

## Preferred Flow

```text
Create Agent
      ↓
Describe what it should do
      ↓
AI interprets intent
      ↓
Agent Blueprint
      ↓
User reviews
      ↓
Activate
```

Contoh:

```text
Create an Agent

What should this agent do?

┌─────────────────────────────────────────────┐
│ Help my team manage incoming project work, │
│ create tickets, document decisions, and    │
│ answer project questions.                   │
└─────────────────────────────────────────────┘

                [Create Agent]
```

AI menghasilkan:

```text
Project Team Assistant

Goal
Help the team manage project information and work.

Capabilities
✓ Create Ticket
✓ Create Doc
✓ Answer Chat Questions

Context
✓ Current project
✓ Tasks
✓ Docs
✓ Chat

Autonomy
Approval required for creating content

[Edit] [Activate]
```

---

# 13. Agent Studio

Agent Studio memiliki dua mode.

## Mode A — Chat

User dapat memodifikasi agent menggunakan natural language.

Contoh:

> “Agent ini hanya boleh bekerja di Project Alpha.”

AI:

> “Updated. This agent can now access only Project Alpha.”

---

## Mode B — Configuration

User dapat melihat struktur:

```text
Identity
Goal
Context
Skills
Triggers
Actions
Permissions
Guardrails
Intelligence
```

Configuration bukan source of intelligence.

Configuration adalah **structured representation dari intent user**.

---

# 14. Agent Blueprint

Blueprint harus menjadi central UX object.

Contoh:

```text
PROJECT ASSISTANT

Identity
Project Operations Assistant

Goal
Help manage project information and work.

Context
• Project
• Tasks
• Docs
• Chat

Skills
• Ticket Creation
• Documentation
• Project Q&A

Actions
• Create Ticket
• Create Doc
• Reply Chat

Autonomy
Approval required

Intelligence
Smart
```

---

# 15. Skill Library

Skill Library adalah reusable internal capability layer.

## MVP Skills

### Skill 01 — Project Context Retrieval

Memahami context dari:

- Project
- Task
- Ticket
- Doc
- Chat

### Skill 02 — Ticket Creation

Membuat structured ticket.

### Skill 03 — Documentation

Menghasilkan structured project documentation.

### Skill 04 — Project Q&A

Menjawab pertanyaan berdasarkan accessible project context.

### Skill 05 — Chat Response

Menghasilkan response sesuai chat context dan permissions.

---

# 16. Skill Composition

Agent dapat menggunakan beberapa skill sekaligus.

Contoh:

```text
Project Guardian

Skills
├── Project Context Retrieval
├── Risk Analysis
└── Ticket Creation
```

Agent:

```text
Request
  ↓
Determine required skill
  ↓
Resolve context
  ↓
Call tools
  ↓
Generate result
```

---

# 17. Skill Rules

Skill:

- harus reusable;
- harus memiliki input schema;
- harus memiliki output schema;
- harus mendefinisikan required tools;
- harus mendefinisikan risk level;
- tidak boleh bypass permission;
- tidak boleh mengubah business state secara implicit.

---

# 18. Tool Registry

Tool adalah action/data interface yang tersedia untuk Agent.

## MVP Read Tools

```text
get_project
get_project_tasks
get_task
get_docs
get_doc
search_docs
search_chat
get_chat_thread
```

## MVP Write Tools

```text
create_ticket
create_doc
send_chat_reply
```

Tool harus menjadi satu-satunya jalur Agent untuk berinteraksi dengan PMS state.

> Agent tidak boleh langsung melakukan database mutation.

---

# 19. Permission Model

Permission harus menjadi first-class object.

## Access Levels

### Read

Agent dapat membaca.

### Draft

Agent dapat membuat draft tetapi tidak publish.

### Approval Required

Agent dapat mengusulkan action dan membutuhkan approval.

### Execute

Agent dapat menjalankan action secara otomatis.

### Denied

Agent tidak dapat menjalankan action.

---

# 20. Recommended MVP Permissions

| Capability | Default |
|---|---|
| Read Project | Allow |
| Read Task | Allow |
| Read Docs | Allow |
| Read Chat | Allow |
| Create Ticket | Approval |
| Create Doc | Approval |
| Reply Chat | Approval |
| Delete Ticket | Denied |
| Delete Doc | Denied |
| Change Deadline | Denied |
| Change Assignee | Denied |

Default harus bersifat conservative.

---

# 21. Autonomy Model

Agent memiliki lima conceptual levels:

```text
LEVEL 1
Observe

LEVEL 2
Recommend

LEVEL 3
Draft

LEVEL 4
Execute with Approval

LEVEL 5
Execute Automatically
```

MVP cukup mendukung:

```text
Recommend
Draft
Execute with Approval
```

Autonomous execution dapat menjadi capability tahap berikutnya.

---

# 22. Human Approval Flow

Untuk action yang memerlukan approval:

```text
Agent
 ↓
Generate Action
 ↓
Approval Required
 ↓
User Review
 ↓
Approve / Reject
 ↓
Execute
```

Contoh:

```text
Create Ticket

Title
Fix authentication timeout

Project
Mobile App

Priority
High

Description
...

[Reject] [Approve]
```

Agent tidak boleh mengatakan “ticket created” sebelum tool execution berhasil.

---

# 23. Trigger Model

MVP dapat menyediakan:

### Manual

```text
Ask Agent
```

### Chat

```text
User mentions Agent
```

### Scheduled

Tahap berikutnya:

```text
Every morning
Every weekday
Every week
```

### Event

Tahap berikutnya:

```text
When ticket created
When task overdue
When milestone changed
```

---

# 24. Agent Chat Experience

Chat menjadi salah satu surface utama Agent.

Contoh:

```text
@ProjectAssistant

Create a ticket for the API timeout issue we discussed.
```

Agent:

```text
I found the relevant discussion.

I drafted:

Fix API timeout after authentication

Project: Mobile App
Priority: High

[Review Ticket]
```

User:

> “Looks good.”

Agent:

```text
Created ticket #PROJ-241.
```

---

# 25. Context Resolution

Agent harus memahami context sebelum bertindak.

Context hierarchy:

```text
Workspace
   ↓
Project
   ↓
Task / Ticket
   ↓
Doc
   ↓
Chat / Thread
```

Context yang lebih spesifik harus diprioritaskan.

Contoh:

```text
Current Chat
    >
Current Project
    >
Related Tasks
    >
Workspace
```

---

# 26. Evidence Policy

Agent harus memisahkan:

```text
FACT
INFERENCE
RECOMMENDATION
UNKNOWN
```

Contoh:

```text
Fact:
Ticket #241 is currently In Progress.

Inference:
The delay appears related to the authentication dependency.

Unknown:
The team has not documented the expected completion date.

Recommendation:
Review the authentication dependency owner.
```

Agent tidak boleh mengubah inference menjadi fact.

---

# 27. Hallucination / Unsupported Claim Policy

Agent harus:

1. Menggunakan accessible system data.
2. Tidak mengarang informasi.
3. Mengakui informasi yang tidak ditemukan.
4. Menyatakan uncertainty ketika diperlukan.
5. Tidak menyatakan action berhasil sebelum tool mengembalikan success.

Contoh:

> “I couldn't verify the reason from the available project context.”

---

# 28. Chat Reply Policy

Untuk reply chat, agent harus memperhatikan:

- channel;
- project;
- thread;
- user;
- recent conversation;
- permissions;
- potentially sensitive content.

Agent harus membedakan:

```text
Answer
vs
Opinion
vs
Recommendation
```

---

# 29. Documentation Policy

Doc yang dibuat agent harus memiliki provenance.

Metadata:

```text
Created by:
AI Agent

Source:
Project Alpha

Generated from:
• Chat #1821
• Ticket #241
• Doc #88

Generated at:
2026-XX-XX
```

User harus dapat melihat source context bila tersedia.

---

# 30. Agent Activity Log

Setiap execution dicatat.

```text
Agent Activity

10:01
Received user request

10:01
Resolved project context

10:02
Retrieved 8 related records

10:02
Drafted ticket

10:03
Approval requested

10:05
User approved

10:05
Ticket created
```

Status:

```text
Received
Planning
Waiting Approval
Executing
Completed
Failed
Cancelled
```

---

# 31. Agent Run Model

Setiap invocation harus memiliki:

```text
AgentRun
├── id
├── agentId
├── workspaceId
├── userId
├── trigger
├── input
├── context
├── skillsUsed
├── toolsUsed
├── proposedActions
├── approvals
├── result
├── status
├── usage
├── startedAt
└── completedAt
```

---

# 32. AI Intelligence

Agent tidak dikunci terhadap model AI tertentu.

Architecture:

```text
Agent
   ↓
Model Policy
   ↓
AI Gateway
   ↓
Model Router
   ↓
Provider
```

Model dapat diganti tanpa mengubah Agent definition.

---

# 33. Intelligence Levels

MVP:

### Fast

Untuk:

- simple Q&A;
- classification;
- summarization;
- extraction.

### Smart

Untuk:

- agent planning;
- multi-step retrieval;
- ticket generation;
- documentation generation;
- contextual chat.

### Expert

Future:

- complex reasoning;
- cross-project analysis;
- deep planning;
- high-complexity agent execution.

Pricing tidak bergantung langsung pada nama model.

---

# 34. AI Monetization Foundation

AI usage harus dapat dimeter sejak MVP.

Konsep:

```text
Subscription
    +
AI Intelligence
```

Usage dapat dihitung berdasarkan:

- execution;
- model tier;
- token usage;
- tool calls;
- context size;
- intelligence level.

User-facing metric:

```text
AI Usage
████████░░ 72%
```

Bukan token technical detail.

Admin dapat melihat:

```text
AI Usage
├── Agent Runs
├── AI Actions
├── Credits Used
├── Cost Estimate
└── Usage by Agent
```

---

# 35. Agent Templates

MVP sebaiknya memiliki beberapa template.

### Project Assistant

Skills:

- Project Q&A
- Ticket Creation
- Documentation

### Documentation Assistant

Skills:

- Project Context Retrieval
- Documentation

### Team Chat Assistant

Skills:

- Project Q&A
- Chat Response

User tetap dapat:

> Start from scratch.

---

# 36. Database Model

Minimum recommended entities:

```text
agents
skills
agent_skills
tools
agent_tools
agent_permissions
agent_triggers
agent_runs
agent_actions
agent_approvals
ai_usage
```

Relationship:

```text
Agent
 ├── AgentSkills → Skill
 ├── AgentTools → Tool
 ├── Permissions
 ├── Triggers
 └── Runs
       └── Actions
              └── Approval
```

---

# 37. Agent Definition Schema

Conceptual TypeScript:

```ts
type AgentDefinition = {
  id: string
  workspaceId: string

  name: string
  description?: string
  goal: string

  skills: string[]
  tools: string[]

  triggers: TriggerDefinition[]

  permissions: PermissionDefinition[]

  guardrails: GuardrailDefinition[]

  intelligence: {
    level: "fast" | "smart" | "expert"
  }

  status: "draft" | "active" | "paused" | "archived"
}
```

---

# 38. Skill Definition Schema

```ts
type SkillDefinition = {
  id: string
  name: string
  description: string

  inputSchema: object
  outputSchema: object

  requiredTools: string[]

  instructions: string

  riskLevel: "low" | "medium" | "high"
}
```

---

# 39. Tool Contract

Setiap tool harus memiliki:

```ts
type ToolDefinition = {
  name: string
  description: string

  inputSchema: object
  outputSchema: object

  access: "read" | "write"

  riskLevel: "low" | "medium" | "high"
}
```

Tool harus deterministic sebisa mungkin.

---

# 40. Backend Architecture

Recommended:

```text
NestJS
│
├── AgentModule
│
├── AgentRuntimeModule
│
├── SkillModule
│
├── ToolModule
│
├── ContextModule
│
├── PermissionModule
│
├── ApprovalModule
│
├── AI GatewayModule
│
├── UsageModule
│
└── ActivityModule
```

Core runtime:

```text
Agent Request
      ↓
Intent Resolution
      ↓
Context Resolution
      ↓
Skill Selection
      ↓
Tool Selection
      ↓
Policy Check
      ↓
Plan
      ↓
Approval?
   /       \
 Yes       No
 ↓          ↓
Wait      Execute
   \       /
    ↓     ↓
      Result
        ↓
      Log
```

---

# 41. Frontend Architecture

Next.js:

```text
/app/agents
    /page
    /new
    /[agentId]

/components/agent
    AgentBuilder
    AgentBlueprint
    AgentCapabilities
    AgentPermissions
    AgentActivity
    AgentRun
    ApprovalCard
    AgentChat
```

Primary surfaces:

```text
Agent List
Agent Builder
Agent Detail
Agent Chat
Approval
Activity Log
```

---

# 42. API Contract — MVP

## Create Agent

```http
POST /agents
```

Request:

```json
{
  "prompt": "Help my team create tickets, document decisions, and answer project questions."
}
```

Backend:

```text
Prompt
→ AI interpretation
→ Agent Blueprint
```

---

## Confirm Agent

```http
POST /agents/:id/activate
```

---

## Run Agent

```http
POST /agents/:id/runs
```

---

## Create Ticket via Agent

Internal tool:

```http
POST /tools/create-ticket
```

---

## Create Doc via Agent

Internal tool:

```http
POST /tools/create-doc
```

---

## Reply Chat via Agent

Internal tool:

```http
POST /tools/send-chat-reply
```

---

## Approve Action

```http
POST /agent-actions/:id/approve
```

---

# 43. Agent State Machine

```text
             ┌───────────┐
             │   DRAFT   │
             └─────┬─────┘
                   │
                Activate
                   ↓
             ┌───────────┐
             │  ACTIVE   │
             └─────┬─────┘
                   │
                Pause
                   ↓
             ┌───────────┐
             │  PAUSED   │
             └─────┬─────┘
                   │
               Resume
                   ↓
             ┌───────────┐
             │  ACTIVE   │
             └───────────┘

ACTIVE
   ↓
Archive
   ↓
ARCHIVED
```

Run state:

```text
RECEIVED
   ↓
PLANNING
   ↓
CONTEXT_RESOLVING
   ↓
EXECUTION_READY
   ↓
WAITING_APPROVAL
   ↓
EXECUTING
   ↓
COMPLETED

Any stage → FAILED
Any cancellable stage → CANCELLED
```

---

# 44. Error Handling

Agent harus mampu menangani:

### Tool Failure

> “I couldn't create the ticket because the project service returned an error.”

### Missing Context

> “I found the request, but I could not determine which project it belongs to.”

### Permission Denied

> “I can draft this action, but I don't have permission to execute it.”

### Ambiguous Request

> “I found two projects matching ‘Mobile App’. I need to know which one you mean.”

### AI Uncertainty

> “I don't have enough evidence to determine the root cause.”

---

# 45. Security Requirements

1. AI API keys hanya berada di backend.
2. Agent tidak boleh menerima permission lebih tinggi daripada user.
3. Tool harus melakukan permission validation server-side.
4. Client tidak boleh menentukan authorization.
5. Sensitive data harus mengikuti existing workspace/project access rules.
6. Semua write action harus dicatat.
7. Approval harus diikat kepada user dan action tertentu.

---

# 46. Observability

Minimum metrics:

```text
agent_runs
agent_success_rate
agent_failure_rate
tool_call_count
approval_rate
rejection_rate
average_execution_time
ai_usage
estimated_ai_cost
```

Agent-level:

```text
Which agent is used most?
Which skill fails most?
Which tool fails most?
Which action requires approval most?
```

---

# 47. MVP Success Metrics

## Adoption

- % workspace yang membuat Agent.
- % user aktif yang menggunakan Agent.
- Average Agents per active workspace.

## Utility

- Agent runs per workspace.
- % successful runs.
- Ticket created through Agent.
- Docs created through Agent.
- Chat questions answered.

## Trust

- Approval acceptance rate.
- User correction rate.
- Action rejection rate.
- Reported incorrect answers.

## Economics

- AI cost per active workspace.
- AI cost per agent run.
- AI cost by intelligence tier.
- AI gross margin.

---

# 48. Acceptance Criteria

## Create Agent

Given user enters a natural-language goal:

System must:

- interpret intent;
- suggest agent name;
- suggest skills;
- suggest context;
- suggest actions;
- suggest permissions;
- produce editable blueprint.

Agent is not activated before user confirmation.

---

## Create Ticket

Given an approved ticket action:

System must:

- validate permission;
- validate required fields;
- create ticket using official PMS tool;
- return ticket ID;
- write audit log.

---

## Create Doc

Given an approved doc action:

System must:

- resolve project context;
- generate structured document;
- attach provenance metadata;
- create doc through official tool;
- log execution.

---

## Reply Chat

Given an approved reply:

System must:

- resolve channel/project/thread context;
- generate response;
- verify permission;
- publish message;
- log source and execution.

---

# 49. Example End-to-End Scenario

User creates:

> “Create an agent to help our product team handle project discussions.”

AI generates:

```text
Product Team Assistant

Goal
Help product team convert project discussions into actionable work
and answer project questions.

Capabilities
✓ Project Q&A
✓ Ticket Creation
✓ Documentation

Context
✓ Project
✓ Tasks
✓ Docs
✓ Chat

Actions
✓ Draft Ticket
✓ Draft Doc
✓ Answer Chat

Autonomy
Approval required

Intelligence
Smart
```

User activates.

Later in chat:

> “This needs to be fixed before next release.”

Agent detects likely actionable work.

It proposes:

```text
I can turn this into a ticket.

Title:
Fix release blocker

Project:
Website Revamp

Priority:
High

[Create Ticket]
```

User approves.

Agent creates the ticket.

Activity log:

```text
Ticket #REV-128 created successfully.
```

---

# 50. Product Principles

### Principle 01 — Intent First

User should describe what they want rather than configure how AI works.

### Principle 02 — Structured Underneath

Natural language must resolve into deterministic structured configuration.

### Principle 03 — Permission Before Action

Agent can never bypass user/workspace permissions.

### Principle 04 — Evidence Before Assertion

Agent should distinguish facts from inference.

### Principle 05 — Human Control

User remains the authority for significant actions.

### Principle 06 — Observable AI

Every meaningful execution must be inspectable.

### Principle 07 — Model Agnostic

Agent architecture must not depend on one LLM provider.

### Principle 08 — Reusable Intelligence

Skills and tools should be reusable across agents.

---

# 51. MVP Scope by Priority

## P0 — Must Have

```text
Agent Creation via Natural Language
Agent Blueprint
Agent Activation
Agent Chat
Skill Registry
Tool Registry
Permission System
Agent Runtime
Create Ticket
Create Doc
Answer Chat
Approval Flow
Agent Activity Log
AI Usage Metering
```

## P1 — Should Have

```text
Agent Templates
Scheduled Trigger
Event Trigger
Advanced Agent Configuration
Agent Analytics
Usage Dashboard
Intelligence Tier Selection
```

## P2 — Later

```text
Autonomous Agent
Custom Skills
Skill Builder
Multi-Agent Collaboration
External Integrations
Agent Marketplace
Advanced Memory
Cross-Workspace Intelligence
```

---

# 52. Recommended Development Sequence

Dengan hanya 1 FE + 1 BE, implementation sebaiknya tidak dimulai dari UI Agent Builder yang besar.

### Phase 1 — Foundation

Backend:

```text
Agent Definition
Skill Registry
Tool Registry
Permission Engine
AI Gateway
Agent Run
```

Frontend:

```text
Agent List
Create Agent
Agent Blueprint
```

### Phase 2 — First Execution

Implement:

```text
Project Context Retrieval
Create Ticket
```

### Phase 3 — Content

Implement:

```text
Create Doc
Project Q&A
```

### Phase 4 — Chat

Implement:

```text
Chat mention
Chat reply
Approval
```

### Phase 5 — Governance & Economics

Implement:

```text
Activity
Usage Meter
Intelligence Tier
Cost Tracking
```

### Phase 6 — Automation

Implement:

```text
Schedule Trigger
Event Trigger
```

---

# 53. Critical Architectural Decision

The most important invariant:

```text
LLM
≠
Business Logic
```

LLM bertugas untuk:

```text
Understand
Plan
Select
Generate
```

PMS backend bertugas untuk:

```text
Authorize
Validate
Execute
Persist
Audit
```

Sehingga:

```text
                 LLM
                  ↓
              Proposal
                  ↓
          Policy / Permission
                  ↓
           Official Tool
                  ↓
              PMS Core
```

Ini mencegah agent menjadi uncontrolled application layer.

---

# 54. Final Product Definition

> **AI Agent is a persistent, permission-bounded AI worker that can understand project context, use reusable skills and tools, answer questions, create project artifacts, and take approved actions on behalf of users.**

Untuk MVP:

```text
            AI AGENT
                │
        ┌───────┼────────┐
        ↓       ↓        ↓
      Ticket    Doc     Chat
        │       │        │
        └───────┼────────┘
                ↓
             Skills
                ↓
              Tools
                ↓
          PMS Core Data
```

---

# 55. MVP Definition of Done

MVP dianggap siap ketika seorang user baru dapat melakukan seluruh flow berikut tanpa training khusus:

```text
1. Create Agent
2. Describe goal in natural language
3. Review Blueprint
4. Activate Agent
5. Ask project question
6. Ask Agent to create ticket
7. Ask Agent to create documentation
8. Approve an action
9. See execution result
10. See agent activity history
```

Pengalaman ideal:

> **“Saya menjelaskan pekerjaan. Agent memahami konteks. Saya mengontrol authority. Agent mengerjakannya.”**
