# Set up CI

This project uses GitHub Actions for CI and should work out of the box. After you've successfully deployed your app, you need to do is set a few ENV vars. Like most CI environments, as you add ENV vars to your app you'll want to also add them in GitHub Secrets.

## Configure Vercel Deployments

To deploy to Vercel, you need to set `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` ENV vars.

![ENV Vars](https://user-images.githubusercontent.com/14339/89292945-228fab00-d62b-11ea-90c2-4198dfcf30f1.png)

The Vercel project and org id, can be copied from `.vercel/project.json`. You can generate a token from https://vercel.com/account/tokens.

### CI Workflow

After tests pass, the app will deploy. Every push will create a preview deployment. Merging to the main branch will deploy to staging, and pushing to the production branch will deploy to production.

If you'd like to change these configurations to a more typical Jamstack flow (where merging to the main branch deploys to production), update the section below in `..github/workflows/main.js.yml`:

```
## For a typical Jamstack flow, this should be your default branch.
## For a traditional flow that auto-deploys staging and deploys prod is as needed, keep as is
if: github.ref != 'refs/heads/production' # every branch EXCEPT production
```

## Configure Heroku Deployments

Heroku needs to login as a user in order to create apps and deploy code. While you can do this using your personal Heroku account, we highly recommend creating a "machine user" for better security (for example, ci@echobind.com). The machine user only has access to the required repositories instead of every repository your user account has access to.

Heroku requires an email and an API Token in order to log in. To get an API token visit your [account settings](https://dashboard.heroku.com/account).

![Heroku Account Settings](https://user-images.githubusercontent.com/14339/90963163-9af7c800-e483-11ea-9a15-0f86bd63cf7e.png)

Next, add `HEROKU_API_TOKEN` and `HEROKU_EMAIL` to GitHub Secrets:

![Heroku Secrets](https://user-images.githubusercontent.com/14339/90963197-df836380-e483-11ea-8449-0076da74c689.png)

After tests pass, the app will deploy. Every push will create a preview deployment. Merging to the main branch will deploy to staging, and pushing to the production branch will deploy to production.

## You're done!

Easiest CI configuration ever, right?
