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


