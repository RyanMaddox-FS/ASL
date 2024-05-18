FROM openjdk:latest

WORKDIR /app

COPY . /app/

RUN javac Main.java

ENTRYPOINT [ "java", "Main" ]