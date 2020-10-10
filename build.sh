#!/bin/bash

: ${IMAGE=wiki}
: ${BRANCH=fix}

git fetch origin $BRANCH --tags
git worktree add wiki $BRANCH

VERSION=$(git -C wiki describe --tags)

jq -r ".dev |= false | .version |= \"$VERSION\"" wiki/package.json >package.json
mv package.json wiki/package.json

docker buildx build -t $IMAGE -f wiki/dev/build/Dockerfile --load wiki
docker tag $IMAGE $IMAGE:$VERSION
docker push $IMAGE
docker push $IMAGE:$VERSION
