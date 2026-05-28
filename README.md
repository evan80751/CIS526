# Lost Communities

## Start the Application

The recommended local setup runs the API and built client in Docker with Postgres.

### 1. Build the app image

```sh
docker build -t lostcommunities-local .
```

### 2. Start the database

```sh
docker compose up -d lostcommunities_db
```

### 3. Create a local network

Run this once:

```sh
docker network create lostcommunities_public
docker network connect lostcommunities_public lostcommunities_db
```

If either command says the network or connection already exists, continue to the next step.

### 4. Start the app

```sh
docker run -d \
  --name lostcommunities \
  --network lostcommunities_public \
  -p 3000:3000 \
  -e SESSION_SECRET=thisisasupersecretkey \
  -e JWT_SECRET_KEY=thisisasupersecretkey \
  -e CAS_URL=https://testcas.cs.ksu.edu \
  -e CAS_SERVICE_URL=http://localtest.me:3000 \
  -e DATABASE_DIALECT=postgres \
  -e DATABASE_HOST=lostcommunities_db \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USERNAME=lostcommunities \
  -e DATABASE_PASSWORD=lostcommunities \
  -e DATABASE_NAME=lostcommunities \
  -e SEED_DATA=true \
  lostcommunities-local
```

Open the app at:

```text
http://localtest.me:3000/
```

Use `localtest.me` instead of `localhost` if the browser has cached HTTPS-only settings for local development.

## Restart After Code Changes

```sh
docker stop lostcommunities
docker rm lostcommunities
docker build -t lostcommunities-local .
```

Then run the app command from step 4 again.

## Stop the Application

```sh
docker stop lostcommunities
docker rm lostcommunities
docker compose stop lostcommunities_db
```

## Optional Client Dev Server

The Vite client can also be run separately for frontend development:

```sh
cd client
npm install
npm run dev
```

The client dev server proxies API requests to `http://localhost:3000`.
