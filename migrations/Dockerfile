FROM mirror.gcr.io/library/alpine:3.24 AS base
WORKDIR /app

RUN apk add --no-cache ca-certificates

FROM mirror.gcr.io/library/golang:1.26.8-alpine AS build
WORKDIR /src
RUN CGO_ENABLED=0 GOOS=linux go install github.com/pressly/goose/v3/cmd/goose@v3.28.0

FROM base AS final
WORKDIR /app
COPY /sql /migrations
COPY --from=build /go/bin/goose .
ENTRYPOINT ["./goose"]
CMD ["up"]