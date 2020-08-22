# Set up CI

This project uses GitHub Actions for CI and should work out of the box. After you've successfully deployed your app, you need to do is set a few ENV vars. Like most CI environments, as you add ENV vars to your app you'll want to also add them in GitHub Secrets.

## Configure for Vercel Deployments

![ENV Vars](https://user-images.githubusercontent.com/14339/89292945-228fab00-d62b-11ea-90c2-4198dfcf30f1.png)

The Vercel project and org id, can be copied from `.vercel/project.json`. You can generate a token from https://vercel.com/account/tokens.

After tests pass, the app will deploy to Vercel. By default, every push creates a preview deployment. Merging to the main branch will deploy to staging, and pushing to the production branch will deploy to production.

If you'd like to change these configurations to a more typical JAMstack flow (where merging to master deploys to production), update the section below in `..github/workflows/main.js.yml`:

```
## For a typical JAMstack flow, this should be your default branch.
## For a traditional flow that auto-deploys staging and deploys prod is as needed, keep as is
if: github.ref != 'refs/heads/production' # every branch EXCEPT production
```

## Configure for Heroku Deployments

Easiest CI configuration ever, right?
