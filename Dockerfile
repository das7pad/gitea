
###################################
#Build stage
FROM golang:1.12-alpine3.9 AS build-env

ARG GITEA_VERSION
ARG TAGS="sqlite sqlite_unlock_notify"
ENV TAGS "bindata $TAGS"

#Build deps
RUN apk --no-cache add build-base git

WORKDIR ${GOPATH}/src/code.gitea.io/gitea

COPY vendor ${GOPATH}/src/code.gitea.io/gitea/vendor/

COPY \
    go.mod \
    go.sum \
    Makefile \
    ${GOPATH}/src/code.gitea.io/gitea/

RUN make clean generate

COPY . ${GOPATH}/src/code.gitea.io/gitea/

#Build gitea
RUN make build

FROM alpine:3.9
LABEL maintainer="maintainers@gitea.io"

EXPOSE 22 3000

RUN apk --no-cache add \
    bash \
    ca-certificates \
    curl \
    gettext \
    git \
    linux-pam \
    openssh \
    s6 \
    sqlite \
    su-exec \
    tzdata

RUN addgroup \
    -S -g 1000 \
    git && \
  adduser \
    -S -H -D \
    -h /data/git \
    -s /bin/bash \
    -u 1000 \
    -G git \
    git && \
  echo "git:$(dd if=/dev/urandom bs=24 count=1 status=none | base64)" | chpasswd

ENV USER git
ENV GITEA_CUSTOM /data/gitea

RUN USER_DIRS="\
        /data/git \
        /data/git/.ssh/ \
        /data/git/repositories \
        /data/gitea \
        /data/gitea/log \
        /data/gitea/conf \
        /data/lfs \
        " \
&&  mkdir -p ${USER_DIRS} \
&&  chown git:git ${USER_DIRS}

VOLUME ["/data"]

ENTRYPOINT ["/usr/bin/entrypoint"]
CMD ["/bin/s6-svscan", "/etc/s6"]

COPY docker/root /
COPY --from=build-env /go/src/code.gitea.io/gitea/gitea /app/gitea/gitea
RUN ln -s /app/gitea/gitea /usr/local/bin/gitea
