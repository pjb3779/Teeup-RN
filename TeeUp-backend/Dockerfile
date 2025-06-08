# 1. JDK 21 기반의 경량 이미지 사용
FROM openjdk:21-jdk-slim

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 로컬에서 빌드된 JAR 파일을 컨테이너로 복사
COPY target/*.jar app.jar

# 🔒 secret 파일 복사 (이 줄 추가)
COPY application-secret.yaml .

# 4. 도커 내부 포트 열기
EXPOSE 8080

# 5. JAR 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
