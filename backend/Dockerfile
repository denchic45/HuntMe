FROM mirror.gcr.io/library/alpine:3.24 AS base
WORKDIR /app
EXPOSE 8080

RUN apk add --no-cache ca-certificates

FROM mirror.gcr.io/library/golang:1.26.8-alpine AS build
WORKDIR /src
COPY ["go.mod", "go.sum", "./"]

RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /main .

FROM base AS final
WORKDIR /app
COPY --from=build /main .
ENTRYPOINT ["./main"]