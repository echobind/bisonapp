# Homebrew - (Mac Only)
## Installing PostgreSQL

```
$ brew install postgresql && createuser postgres --superuser
```

## Start Server and Login

```
$ brew services start postgresql
$ psql postgres
```