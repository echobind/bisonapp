# Postgres.app (Mac Only)
**This is only available for Mac users*

[Download Postgres.app]([https://postgresapp.com/downloads.html](https://postgresapp.com/downloads.html))

[https://postgresapp.com/downloads.html](https://postgresapp.com/downloads.html)

## What is PostgreSQL?

Open-sourced relational database management system (RDBMS) used to create and modify databases

## Installing and Setting up Postgres.app

1. Download the Latest Version → Move it to Applications folder (required) → Double Click
2. Create a new server by clicking "Initialize"
3. Copy and paste the following to configure the `$PATH` and use the command line tools

```
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
```

 4. Start [Postgres.app](http://postgres.app) and restart your terminal

### Default Settings:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95472c60-f022-4240-bea2-1d8bc885e51d/Screen_Shot_2020-12-30_at_5.15.46_PM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95472c60-f022-4240-bea2-1d8bc885e51d/Screen_Shot_2020-12-30_at_5.15.46_PM.png)

## Connect to a Database using Postgres.app

Double click the database you want to connect to