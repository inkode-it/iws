VERSION 0.6

django:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE .
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


documentation:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./docker/documentation/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


geoserver:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./docker/geoserver/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


nginx:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./docker/nginx/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


istorm:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./istorm/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


postgis:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./docker/postgis/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH


letsencrypt:
    ARG EARTHLY_GIT_HASH
    ARG EARTHLY_TARGET_NAME
    ARG BRANCH
    ARG USER
    FROM DOCKERFILE ./docker/letsencrypt/
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$BRANCH
    SAVE IMAGE --push ghcr.io/$USER/iws/iws_$EARTHLY_TARGET_NAME:$EARTHLY_GIT_HASH
