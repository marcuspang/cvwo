dev:
  docker-compose up

build:
  docker build -t cvwo-prod . --target production

start:
  docker run -p 80:4000 --name cvwo-prod cvwo-prod