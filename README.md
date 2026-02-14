# Team Hayavadana: Seva Platform Submission
### Official Hackathon Artifacts for Sode Sri Vadiraja Matha

The **Seva Platform** is a 360-degree ecosystem designed to bridge the gap between ancient traditions and modern devotees. Built by **Team Hayavadana**, this project delivers a production-ready mobile app, a web-based dashboard, and a robust Java Spring Boot backend.

## 🚀 Submission Dashboard
| Artifact | Description | Documentation Link |
| :--- | :--- | :--- |
| **Source Code** | Clean, modular codebase in React Native & Spring Boot | [View Repositories](#project-structure) |
| **UI/UX Design** | Full user flows, wireframes, and design system | [ui_ux_spec.md](SUBMISSION/ui_ux_spec.md) |
| **Backend Docs** | API endpoints, Database Schema & Firebase Integration | [backend_spec.md](SUBMISSION/backend_spec.md) |
| **Executable** | Guide to running & building the APK/JAR | [executable_guide.md](SUBMISSION/executable_guide.md) |
| **Verification** | Checklist of all met requirements | [verification.md](SUBMISSION/verification.md) |

## 🛠️ Technology Stack
- **Mobile**: React Native (TypeScript), Expo, Firebase SDK.
- **Backend**: Java 17, Spring Boot 3.2, JPA/Hibernate.
- **Database**: MySQL 8.0 (Production) / H2 (Demo).
- **Security**: Firebase Auth & Admin SDK.


## Project Structure

```text
.
├── seva_mobile/        # React Native mobile application
├── seva_ui/            # Web UI application (React or Angular)
├── seva_platform/      # Backend platform (Java + Spring Boot)
└── README.md           # Project documentation
```

---

## High-Level Architecture

> Both Mobile and Web clients communicate only with the backend APIs (clients do not talk to the database directly).

```text
Mobile App (React Native) ──┐
                            ├──> Backend APIs (Spring Boot) ───> Database (MySQL 8.x)
Web UI (React / Angular) ───┘
```

---

## Detailed Directory Structures

### seva_mobile/
```text
seva_mobile/
├── android/                 # Android native project
├── ios/                     # iOS native project
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # App screens
│   ├── navigation/          # Navigation setup
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilities
│   └── assets/              # Images, fonts, icons
├── .env
├── package.json
└── tsconfig.json
```

### seva_ui/
```text
seva_ui/
├── src/
│   ├── components/          # Shared UI components
│   ├── pages/               # Route-based pages
│   ├── layouts/             # App layouts
│   ├── services/            # API clients
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Helper utilities
│   └── assets/              # Static assets
├── public/
├── .env
├── package.json
└── tsconfig.json
```

### seva_platform/
```text
seva_platform/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/seva/platform/
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── service/        # Business logic
│   │   │       ├── repository/     # Database repositories
│   │   │       ├── model/          # Entity models
│   │   │       ├── dto/            # Request/response DTOs
│   │   │       ├── security/       # Authentication & security
│   │   │       └── config/         # Configuration classes
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/       # Flyway migrations
│   └── test/
├── Dockerfile
├── pom.xml
└── README.md
```
