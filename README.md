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
- Builds Angular and API outputs from the pushed tag, selected manual ref, or supplied manual release tag
- Publishes both as workflow artifacts
- Publishes zipped assets to GitHub Releases when building a tag
- Deploys on tag pushes and on manual runs with `deploy` enabled:
  - Angular output to `/jkajoondalup.com/`
  - API output to `/jkajoondalup.com/api/`

Manual release inputs:
- `release_tag` (optional existing tag to build and publish; otherwise the selected ref is built)
- `deploy` (`true` to run FTPS deployment on manual runs; defaults to `false`)

Deployment uses explicit FTPS with certificate validation. The paths are absolute
within the FTP account's server root. The action tracks deployed files separately
for Angular and the API; files previously deployed by the action may be removed
when no longer in the build. IIS must already be configured to run the API as an
ASP.NET Core application under `/api`; uploading files does not configure IIS.
Files included in the published API, including `appsettings.json`, are overwritten
on deployment; keep production-specific settings outside the deployed files.

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


