# GitHub Issues Guide — NordWacht_01

> **Purpose**: This document is the single source of truth for how we track work using GitHub Issues. Feed this file to any AI dev agent at the start of every chat session so it follows our workflow consistently.

---

## 1. Core Principles

1. **Every unit of work gets an issue.** No code change should happen without a linked issue.
2. **Issues are living documents.** Update them as work progresses — don't create and forget.
3. **Milestones reflect real goals.** Every issue must belong to a milestone.
4. **Labels tell the story at a glance.** Always apply the correct labels.
5. **Close with evidence.** Issues are closed only when the acceptance criteria are met and verified.

---

## 2. Standard Labels

Apply these labels when creating issues:

| Label | Description |
|---|---|
| `enhancement` | New features or improvements |
| `bug` | Error or broken functionality |
| `documentation` | Changes to README, guides, or code comments |
| `refactor` | Code cleanup without logic change |
| `urgent` | Blocks critical workflows |

> **Rule**: Every issue must have **at least one** label applied. Use `urgent` alongside any other label when something is blocking.

---

## 3. Issue Templates

### 3.1 Feature Issue
```markdown
## Summary
[One-sentence description of the feature]

## Motivation
[Why is this needed? What problem does it solve?]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Technical Notes
[Implementation hints, dependencies, or constraints]

## Related Issues
- Depends on: #___
- Blocks: #___
```

### 3.2 Bug Issue
```markdown
## Bug Description
[What is happening vs. what should happen]

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS:
- Browser/Runtime:
- Version/Commit:

## Acceptance Criteria
- [ ] Bug is no longer reproducible
- [ ] Regression test added (if applicable)
```

### 3.3 Research / Spike Issue
```markdown
## Question
[What are we trying to learn or decide?]

## Context
[Background information and why this matters now]

## Deliverables
- [ ] Written summary of findings (posted as a comment)
- [ ] Recommendation with pros/cons
- [ ] Follow-up issues created (if applicable)

## Time Box
[Maximum time to spend: e.g., 4 hours]
```

---

## 4. Milestones

Milestones represent major project phases or deliverable targets. Every issue **must** be assigned to a milestone.

### Milestone Naming Convention
```
v<major>.<minor> — <Short Description>
```
**Examples:**
- `v0.1 — Project Foundation`
- `v0.2 — Core Security Scanner`
- `v1.0 — MVP Release`

### Milestone Rules
- Each milestone has a **due date** (even if estimated).
- When all issues in a milestone are closed, **close the milestone**.
- If scope changes, **update the milestone description** with a comment explaining why.

---

## 5. Agent Workflow — Step by Step

> **This is what the AI dev agent must follow every session.**

### At the Start of a Session
1. **Read this guide** to load the workflow rules.
2. **Check open milestones** — understand current project phase.
3. **Review open issues** — identify what's in progress or blocked.
4. **Ask the user** what they want to work on if not specified.

### Before Writing Code
1. **Find or create the issue** for the work being done.
   - If an issue exists → add a comment that work is starting.
   - If no issue exists → **create one** using the appropriate template above, assign the correct label(s) from Section 2, and link it to the correct milestone.
2. **Comment on the issue** with a brief plan of what will be done.

### While Writing Code
1. **Reference the issue number** in commit messages: `Fix input validation (#12)`.
2. If the scope grows or changes, **update the issue description** and acceptance criteria.
3. If blockers are found, **add the `urgent` label** and comment with details about the blocker.

### After Completing Work
1. **Update the issue** with a summary comment of what was done.
2. **Check off acceptance criteria** in the issue body.
3. If the work is fully verified, **close the issue**.
4. If this was the last issue in a milestone, **notify the user** that the milestone may be ready to close.

### Creating Follow-Up Issues
- If new work is discovered during a session, create new issues immediately.
- Link them to the parent issue with `Related: #___`.
- Assign the correct milestone and labels.

---

## 6. Issue Hygiene Checklist

Run this checklist periodically (or when the user asks for a project status review):

- [ ] Every open issue has **at least one** standard label (`enhancement`, `bug`, `documentation`, `refactor`, `urgent`).
- [ ] Every open issue is assigned to a **milestone**.
- [ ] No issue has been open for more than 3 sessions without an update comment.
- [ ] Issues marked `urgent` have a **comment explaining the blocker**.
- [ ] Completed milestones are **closed**.
- [ ] There are no orphan issues (issues with no milestone).

---

## 7. Quick Reference — Agent Commands

| Action | What to Do |
|---|---|
| Start new work | Create issue → add label(s) → assign milestone → comment plan |
| Continue existing work | Find issue → comment update on progress |
| Finish work | Comment summary → check acceptance criteria → close issue |
| Hit a blocker | Add `urgent` label → comment with details |
| Discover new work | Create new issue → link to parent → assign milestone + label(s) |
| Project status check | List open milestones → summarize open/closed issues |
| Milestone complete | Verify all issues closed → close milestone → notify user |

---

## 8. Commit Message Convention

```
<type>(<scope>): <short description> (#<issue-number>)
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
**Scope:** component or area (e.g., `scanner`, `api`, `auth`)

**Examples:**
```
feat(scanner): add port scanning module (#5)
fix(auth): resolve token expiration bug (#12)
docs(readme): update installation instructions (#3)
chore(ci): add GitHub Actions workflow (#8)
```

---

*Last updated: 2026-04-21*
