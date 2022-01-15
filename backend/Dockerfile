# syntax=docker/dockerfile:1

##
## Build
##
FROM golang:1.17-alpine

# folder containing files
WORKDIR /app

COPY . ./
# install go dependencies
RUN go mod download
RUN go build -o /bin

##
## Deploy
##
FROM alpine

WORKDIR /

COPY --from=build /bin /bin

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/bin"]