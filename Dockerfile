# Node Version
ARG NODE_VERSION=22

###############################
# STAGE 1 - BUILD CLIENT      #
###############################

# Client Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as client

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=client/package.json,target=package.json \
    --mount=type=bind,source=client/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copy the rest of the source files into the image.
COPY ./client .

# Build the client application
RUN npm run build

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY ./server .

# Copy the built version of the client into the image
COPY --from=client /usr/src/app/dist ./public

# Make a directory for the database and make it writable
RUN mkdir -p ./data
RUN chown -R node:node ./data

# Make a directory for the uploads and make it writable
RUN mkdir -p ./public/uploads
RUN chown -R node:node ./public/uploads

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Command to check for a healthy application
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api || exit 1

# Run the application.
CMD npm run start