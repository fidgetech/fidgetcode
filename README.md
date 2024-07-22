# Fidgetcode

### Configuration

- Set secrets in `.env` and `functions/.env` per respective `.env.example` files.
- Run `bash update-github-secrets.sh` to copy Fidgetcode env vars to GitHub Secrets for production.
- Run `firebase deploy --only functions` to deploy firebase functions, including env vars.

### Deployment

Deploy front-end: deploys automatically on merge to main branch

Deploy back-end: `firebase deploy --only functions`
