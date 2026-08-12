# One image: React build baked into the Spring Boot jar.
# No CORS, no second deploy, one URL.

# ---- stage 1: build the frontend ----
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- stage 2: build the jar with the frontend inside it ----
FROM maven:3.9-eclipse-temurin-17 AS api
WORKDIR /api
COPY backend/pom.xml ./
RUN mvn -q dependency:go-offline
COPY backend/src ./src
COPY --from=web /web/dist ./src/main/resources/static
RUN mvn -q clean package -DskipTests

# ---- stage 3: run ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=api /api/target/portfolio-api-1.0.0.jar app.jar
EXPOSE 8080
# Keep the heap inside a 512 MB free-tier container.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"
ENTRYPOINT ["java","-jar","app.jar"]
