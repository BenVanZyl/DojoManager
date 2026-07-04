# DojoManager

Sharing my code that helps me run my Karate club.

## About the Club

- Dojo name: JKA PERTH
- Domains:
  - jkaperth.com
  - jkaperth.com.au
  - jkajoondalup.com

**The default domain is jkaperth.com**

## Application purpose

- Provide genereal information to the public
- Allow the public to contact me.
- Provide a secured space where
  - I can keep track of students
    - attendance
    - grading (belt) levels
    - grading history
    - competition history
  - Manage news feed for the websites.
 
## Current State

### jkaperth.com

Blazor Server app with secured area with some of the required functionality .  Needs some bug fixes.

### jkaperth.com.au

HTML Website providing public info only

### jkajoondalup.com

No web site configured.

## Future State

### jkaperth.com

- Blazor Server app with secured area providing required features.
- Contains REST WEB API endpoints for use by the other domains.

### jkaperth.com.au

Angular App providing info to the public by retrieving relevant data from the default domain using REST API:
- contact info
- news feed

### jkajoondalup.com

REACT App providing info to the public by retrieving relevant data from the default domain using REST API:
- contact info
- news feed

## Build and Release Management

Currently this is done manually.  This process will be migrated to GitHub.com in order to have automated build and release pipelines.

## GitHub Actions Pipelines

The repository now uses GitHub Actions for CI, release publishing, and deployment.

### CI pipeline

File: `.github/workflows/ci.yml`

Triggers:
- Push to `main`
- Pull request targeting `main`
- Manual run (`workflow_dispatch`)

Quality and security gates:
- Angular: dependency install, production build, unit tests, `npm audit` (high+)
- API: restore, release build, NuGet vulnerability scan (direct and transitive)
- CodeQL analysis for C# and JavaScript/TypeScript
- Snyk scan (`--all-projects`, high+ severity threshold)

### Release and deployment pipeline

File: `.github/workflows/release.yml`

Triggers:
- Any tag push
- Manual run (`workflow_dispatch`)

Behavior:
- Builds Angular and API outputs
- Publishes both as workflow artifacts
- Publishes zipped assets to GitHub Releases for tag-based releases
- Deploys to FTPS:
  - Angular output to `/public_html`
  - API output to `/api`

Manual release inputs:
- `release_tag` (required when manually publishing/deploying)
- `deploy` (`true` to run FTPS deployment on manual runs)

### Required repository secrets

CI / security:
- `SNYK_TOKEN`

Release / deployment:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PORT` (optional, defaults to `21`)

### Recommended environment protection

Create a GitHub environment named `production` and add required reviewers for the deploy job.


