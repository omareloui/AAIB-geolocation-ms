# Geolocation MicroService for AAIB

## Ideas to host the db file

- Use Cloudinary or a AWS bucket to host it.
- Ask the DevOps for a volume.
- Keep the local version.

## Get it running

### Setup the environment

Copy the `.env.example` file to `.env` and fill out the values for the new file.

### Install the packages

```bash
npm i
```

### Start the server

#### Start it in development

```bash
npm run start:dev
```

#### Start it in production

```bash
npm run build
npm run start:prod
```

### Regenerate the database from provided data

You have to delete `/db/db.json` if it already exists. Then run:

```bash
npm run db:restructure
```
