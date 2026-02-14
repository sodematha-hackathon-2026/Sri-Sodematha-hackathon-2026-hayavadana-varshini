# Seva Platform - Backend

This is the backend platform for Seva, built with Java and Spring Boot.

## Structure
- `src/main/java/com/seva/platform/controller`: REST API endpoints.
- `src/main/java/com/seva/platform/service`: Business logic.
- `src/main/java/com/seva/platform/repository`: Database access layers.
- `src/main/java/com/seva/platform/model`: Database entities.
- `src/main/java/com/seva/platform/dto`: Data Transfer Objects.
- `src/main/java/com/seva/platform/security`: Security and authentication configurations.
- `src/main/java/com/seva/platform/config`: General application configurations.

## Setup
1. Prerequisites: Java 17+, Maven 3.x+
2. Database: MySQL 8.x
3. Configuration: Update `src/main/resources/application-dev.yml` with your local DB credentials.
4. Run: `mvn spring-boot:run`
