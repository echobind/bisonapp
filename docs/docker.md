## Setting up Docker

Bison includes a `docker-compose.yml`, `Dockerfile` and `.dockerignore`

The configuration is to run a postgres database locally. 

If you are interested in running the entire app, please see the examples below.

## Running the Database

To run postgres with docker, please add the following information to your `env` & `env.local` file.
```
DATABASE_URL="postgresql://dev:dev@localhost:5432/dev?schema=public"
```
Run `docker-compose up -d` in your terminal. If you prefer not to run in detached mode, you can remove the `-d` flag.

To shut down docker, run `docker-compose down`

## Using NextJS & Postgres with Docker

The following configuration will help you run NextJS & Postgres. 

Make sure `@prisma/client` is on version: `3.13.0`,

Dockerfile
```Dockerfile
FROM node:lts
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
```

Add this to your services in `docker-compose.yml` file:
```docker
services:
  nextjs:
    build:
      context: ./
    command: bash -c "yarn db:migrate && yarn db:seed && yarn dev"
    container_name: nextjs
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
```

Change your database URL in your `env.local` to:
``` 
DATABASE_URL="postgres://dev:dev@postgres/dev?schema=public"
```

Somtimes your NextJs will not run due to postgres still booting up. You can add `connect_timeout=300` to the database URL. If you continue to have issues, you can press the `start` button in the docker application. 

To run NextJs with Prisma, it is best to use `node:lts`. There are current issues with running NextJs and Prisma using `node:alpine`

Run `docker-compose up -d`
Run `docker-compose down` to shut down.