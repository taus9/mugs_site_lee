# ---- Builder ----
ARG GO_VERSION=1.25.4
FROM golang:${GO_VERSION}-bookworm AS builder

WORKDIR /usr/src/app

# Copy go.mod first for dependency caching
COPY go.mod ./

# Download deps (will generate go.sum if missing)
RUN go mod download

# Copy the rest of the source
COPY . .

# Build the web app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -v -o /run-app ./cmd/web

# ---- Runtime image ----
FROM debian:bookworm

WORKDIR /app

# Install CA certificates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /run-app /usr/local/bin/run-app

# Copy templates and static files
COPY --from=builder /usr/src/app/ui ./ui

EXPOSE 8080

# Use Fly.io PORT environment variable
CMD ["run-app"]
