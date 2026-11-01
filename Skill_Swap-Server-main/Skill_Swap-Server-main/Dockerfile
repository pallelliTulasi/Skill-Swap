# Step 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Step 2: Run the application
FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Expose default port (optional, Render ignores)
EXPOSE 8080

# Run Spring Boot with dynamic port (shell form)
CMD java -Dserver.port=$PORT -jar app.jar
