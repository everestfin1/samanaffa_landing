> ## Documentation Index
> Fetch the complete documentation index at: https://docs.didit.me/llms.txt
> Use this file to discover all available pages before exploring further.

# AI Agent Skills

> Integrate Didit KYC and identity verification into AI agents, Cursor, Claude Code, and ClawHub via single-prompt SDK skills. Agent-native, MCP-ready.

## What are Agent Skills?

Agent Skills are pre-built instruction sets that allow AI coding assistants (like Cursor, GitHub Copilot, Claude, etc.) to integrate Didit's identity verification APIs into your codebase with a single command.

Each skill contains:

* Complete API documentation and endpoint details
* Authentication setup instructions
* Request/response schemas with examples
* Ready-to-use code snippets
* Error handling patterns

***

## Available Skills

| Skill                         | Description                                                                | Install                                     |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| **didit-sessions**            | Full session management, workflows, blocklist, and webhooks (11 endpoints) | `clawhub install didit-sessions`            |
| **didit-id-verification**     | ID document verification with OCR and authenticity checks                  | `clawhub install didit-id-verification`     |
| **didit-passive-liveness**    | Deepfake and spoof detection from selfie images                            | `clawhub install didit-passive-liveness`    |
| **didit-face-match**          | 1:1 face comparison between selfie and document photo                      | `clawhub install didit-face-match`          |
| **didit-face-search**         | 1:N face search across previous verifications                              | `clawhub install didit-face-search`         |
| **didit-age-estimation**      | Age estimation from selfie photo                                           | `clawhub install didit-age-estimation`      |
| **didit-aml-screening**       | AML, PEP, and sanctions screening                                          | `clawhub install didit-aml-screening`       |
| **didit-database-validation** | Government database cross-validation                                       | `clawhub install didit-database-validation` |
| **didit-email-verification**  | Email ownership verification via OTP                                       | `clawhub install didit-email-verification`  |
| **didit-phone-verification**  | Phone number verification via SMS/WhatsApp                                 | `clawhub install didit-phone-verification`  |
| **didit-proof-of-address**    | Proof of address document extraction and validation                        | `clawhub install didit-proof-of-address`    |

***

## Quick Install

### Via ClawHub (Recommended)

Install all skills at once:

```bash theme={null}
clawhub install didit-sessions didit-id-verification didit-passive-liveness didit-face-match didit-aml-screening
```

If `clawhub` is not installed globally, use:

```bash theme={null}
npx clawhub@latest install didit-sessions didit-id-verification didit-passive-liveness didit-face-match didit-aml-screening
```

### Via Cursor IDE

Copy skills directly into your project:

```bash theme={null}
# Clone the skills repo
git clone https://github.com/didit-protocol/skills.git

# Copy the skills you need into your project
cp -r didit-agent-skills/skills/didit-sessions .cursor/skills/
cp -r didit-agent-skills/skills/didit-id-verification .cursor/skills/
```

### Via GitHub

Browse and download individual skills from the repository:

<Card title="didit-agent-skills" icon="github" href="https://github.com/didit-protocol/skills">
  All 11 Didit AI Agent Skills — open source on GitHub
</Card>

***

## Setup

All skills require a `DIDIT_API_KEY` environment variable. Some skills require additional variables:

```bash theme={null}
# Required for all skills
export DIDIT_API_KEY="your-api-key-here"

# Required for session-based workflows
export DIDIT_WORKFLOW_ID="your-workflow-id-here"

# Required for webhook signature verification
export DIDIT_WEBHOOK_SECRET="your-webhook-secret-here"
```

Get your API key from the [Business Console](https://business.didit.me) → **API & Webhooks** in the sidebar.

***

## How It Works

Once installed, simply ask your AI assistant to perform verification tasks:

> "Create a verification session for a new user signup"

> "Add ID verification to my Express.js backend"

> "Set up webhook handling for verification status updates"

> "Screen this user against AML/PEP watchlists"

The AI will read the skill documentation and generate production-ready code using Didit's APIs.
