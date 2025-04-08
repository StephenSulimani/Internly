# Internly

## By [Stephen Sulimani](https://github.com/stephensulimani)

### Description

Internly is a Discord bot that helps the members of the [Phi Colony of Kappa Theta Pi](https://ktpgeorgia.com/) find tech internships.
To begin, Internly will create an auto-updating feed of aggregated internship listings from numerous sources, listed below.

Internly will be split into two parts, a Discord bot and a crawler. The Discord bot will be used to display the aggregated feed to the
members of KTP, while the crawler will be used to pull the internship listings from various sources and aggregate them into one feed.

## Sources
- [arunike/Summer-2025-Internship-List](https://github.com/arunike/Summer-2025-Internship-List)
- [speedyapply/2025-SWE-College-Jobs](https://github.com/speedyapply/2025-SWE-College-Jobs)
- [cvrve/Summer2025-Internships](https://github.com/cvrve/Summer2025-Internships)
- [SimplifyJobs/Summer2025-Internships](https://github.com/SimplifyJobs/Summer2025-Internships)
- [InternStreet](https://www.internstreet.co/swe)
- [ClimateTechList](https://www.climatetechlist.com/university)
- [Levels.fyi](https://www.levels.fyi/internships/?track=Software%20Engineer&timeframe=2025%20%2F%202024)

### Tech Stack

| **Technology** | **Description** | **Role in Project** |
| --- | --- | --- |
| **TypeScript** | A superset of JavaScript that adds optional static typing and other features | Primary programming language, providing type safety and maintainability |
| **Discord.js** | A JavaScript library for interacting with the Discord API | Creating a Discord bot that interacts with users and performs tasks on the Discord platform |
| **Bun** | A fast and lightweight JavaScript runtime environment | Runtime environment for the project, providing fast and efficient execution of TypeScript code |
| **Sqlite** | A self-contained, file-based relational database | Database management system, storing and retrieving data in a structured and efficient manner |
| **Prisma** | A database ORM for TypeScript and Node.js | ORM for the database, providing a simple and easy-to-use interface for interacting with the database |

### Features

### Todo

| Feature | Description | Priority |
| --- | --- | --- |
| Bot Skeleton | Create skeleton for Discord bot | High |
| Crawler Interface | Create interface for crawler | High |
| Role Notifications | Create role-based notifications for internships | Medium |

### Completed

| Feature | Description | Date Completed |
| --- | --- | --- |
| Bot Skeleton | Framework for adding commands and handlers to the Discord bot | 03-10-2025

### Installation

To install dependencies:
```bash
bun install
```

To run:
```bash
bun run index.ts
```
