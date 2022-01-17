### Development
FROM golang:1.17 as development

# Add a work directory
WORKDIR /app

# Copy app files and install dependencies
COPY . .
RUN go mod download
# Install Reflex for development
RUN go install github.com/cespare/reflex@latest

# Expose port
EXPOSE 4000

# Start app
CMD reflex -g '*.go' --start-service -v -- sh -c 'go run main.go -port=:4000'

### Production
FROM golang:1.17 as builder

WORKDIR /app

COPY . .
RUN go mod download

# ENV from docker's website on building go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:3.14 as production

RUN apk add --no-cache ca-certificates

COPY --from=builder app .

EXPOSE 4000

CMD ["./app", "-prod", "-port :4000"]