# Run Postgres with Bison 

1. Setup a database locally ([Postgres](https://postgresapp.com/downloads.html) is the only type fully supported right now)
1. Make sure your database user has permission to create schemas and databases. We recommend using a superuser account locally to keep things easy.
1. Setup your local database with `yarn db:setup`. You'll be prompted to create it if it doesn't already exist:1. Setup a database locally ([Postgres](https://postgresapp.com/downloads.html) is the only type fully supported right now)
1. Make sure your database user has permission to create schemas and databases. We recommend using a superuser account locally to keep things easy.
1. Setup your local database with `yarn db:setup`. You'll be prompted to create it if it doesn't already exist:
When creating a bison app, you are prompted with questions to set up your app along with Postgres. 

![Prisma DB Create Prompt](https://user-images.githubusercontent.com/14339/88480536-7e1fb180-cf24-11ea-85c9-9bed43c9dfe4.png)

Need help setting up Postgres locally?

#### Install Postgres on Mac
Mac: https://postgresapp.com/

#### Install Postgres on Windows
Windows: https://www.postgresql.org/download/windows/

## Run Postgres with Docker

The following configuration sets up a Postgres database.

Create a `docker-compose.yml` file to the root directory of your application and add the following

```bash
version: '3.8'

services:
  db:
    container_name: postgres
    ports:
      - '5433:5432'
    image: postgres:latest
    volumes:
      - ./.data/postgres:/var/lib/postgresql/data
    restart: always
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: dev
```
A different schema is created for your testing data.

Please note the ports to adjust your environment variables. See below for an example. 

Add `.data/` to your `.gitignore`

#### Edit your environment variables:
Change the database URL in `.env.local`:
```
DATABASE_URL="postgres://dev:dev@postgres:5433/dev?schema=public"
```

and

`.env.test`
```
DATABASE_URL="postgres://dev:dev@postgres:5433/dev?schema=testing"
```

**Note**: When creating a bison app, if you answered something else rather than `dev` when prompted, "What is the local test database
name?" You will have to set the variable `testDabaseName` to `dev` in `test/jest.setup.js` file.

Run the following command in your terminal:
`docker-compose up -d` 

To shut it down:
`docker-compose down`

## Optional - Package.json
Add the following to your `package.json`

```json
"scripts": {
  "docker:up": "docker-compose up -d",
  "docker:down" "docker-compose down" 
}
```

For more information about Docker please refer to the documentation [Docker](https://docs.docker.com/).
