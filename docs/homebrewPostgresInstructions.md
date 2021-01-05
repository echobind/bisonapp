# Homebrew - (Mac Only)
## Installing PostgreSQL

1. Install using hombrew: `brew install postgres`
2. Add a local user (we recommend creating as a superuser to keep setup simple):  `create user postgres --superuser`

## Start Server and Login

```
$ brew services start postgresql
$ psql postgres
```