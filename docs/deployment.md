# Preview / Staging and Production Deployment Setup

## Deploying to Vercel

- Create a new Vercel app by running `vercel`.
- Create a staging and production database on Heroku, Digital Ocean, or AWS. For production, you likely want to enable some form of connection pooling so that you don't exhaust database connections.
- Add the appropriate values for the `APP_SECRET` and `DATABASE_URL` ENV vars to the app settings page (https://vercel.com/<org>/<app>/settings/environment-variables). Use the staging URL for preview and the production URL for production.

Verify things work by running `vercel` again.

## Deploying to Heroku

Heroku is not typically used to host Jamstack apps. If possible, you should leverage Vercel or Netlify (coming soon!) as they have some advantages in doing so. That said, we wanted to ensure Bison apps could still be deployed to Heroku if required. Especially since many choose to use Heroku to host their database.

- Create a new staging app: `heroku apps:create myapp-staging --remote staging`
- Add a value for APP_SECRET. `heroku config:add APP_SECRET=mysecret --remote staging`
- Add a database: `heroku addons:create heroku-postgresql:hobby-dev --remote staging`
- Create a new production app: `heroku apps:create myapp --remote production`
- Add a value for APP_SECRET. `heroku config:add APP_SECRET=mysecret --remote production`
- Add a database: `heroku addons:create heroku-postgresql:standard-0 --remote production`. If you're just testing things out, hobby-dev is sufficient. For production apps, you'll want to use the Standard Tier.

Verify things work by running `git push staging` and `git push production`.
