<div style="background: black;">
<p align="center" style="margin: 0;">
  <a href="https://dev.marblism.com" target="blank">
    <img src="https://marblism-dashboard-api--production-public.s3.us-west-1.amazonaws.com/marblism-logo.png" height="150" alt="Marblism Logo" />
  </a>
</p>
<h1 align="center" style="margin: 0;">In Marble We Trust</h1>

<a  style="margin: 0;" target="_blank" href="https://marblism.com">
<p align="center" style="margin: 0; letter-spacing: 3px;
text-decoration: none;">
marblism
</p>
</a>
</div>
<div style="height: 50px; background: linear-gradient(#000000, transparent);"></div>

## Documentation

Learn more in the [official documentation](https://dev.marblism.com).

## Installation

<div style="color: red;">

> ⚠️ **Important**<br/>Make sure the following tools are installed on your computer

<p align="center">

<a target="_blank" href="https://www.docker.com/get-started/">![Docker Desktop Version](https://img.shields.io/badge/Docker%20Desktop-4.19.0-black?logo=docker)</a>
<a target="_blank" href="https://nodejs.org/en">![Node.js version](https://img.shields.io/badge/Node.js-20.11.0-black?logo=nodedotjs)</a>
<a target="_blank" href="https://www.npmjs.com/">![npm Version](https://img.shields.io/badge/npm-10.2.4-black?logo=npm)</a>

</p>
</div>

<br />

```bash
$ pnpm run init
```

## Development

```bash
$ pnpm run dev
```

[View your application in your browser](http://localhost:8099)

## Production

```bash
$ pnpm run build
$ pnpm run start
```

## Support

We reply FAST on our <a target="_blank" href="https://discord.gg/GScNz7kAEu">Discord server</a>.

## Stay in touch

[@marblismAI](https://twitter.com/marblismAI)

# Law Manage Pro

## Telepítés és Fejlesztői Környezet

### Előfeltételek
- Docker Desktop
- Node.js 20.11.0 vagy újabb
- pnpm 10.2.4 vagy újabb

### Telepítési lépések

1. Klónozza le a repository-t:
```bash
git clone [repository-url]
cd lawmanagepro
```

2. Telepítse a függőségeket:
```bash
pnpm install
```

3. Másolja le az .env.template fájlt .env néven és állítsa be a szükséges környezeti változókat:
```bash
cp .env.template .env
```

4. Indítsa el a fejlesztői környezetet:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. Futtassa az adatbázis migrációkat:
```bash
pnpm prisma migrate dev
```

6. Indítsa el a fejlesztői szervert:
```bash
pnpm run dev
```

Az alkalmazás elérhető lesz: http://localhost:8099

### Tesztelés

1. Tesztelési környezet indítása:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Tesztek futtatása:
```bash
pnpm test
```

### Fejlesztői eszközök

- PgAdmin: http://localhost:5052
  - Email: admin@admin.com
  - Jelszó: root
- Mailpit: http://localhost:8022

## Produkciós Környezet

1. Építse meg az alkalmazást:
```bash
pnpm run build
```

2. Indítsa el a produkciós környezetet:
```bash
docker-compose up -d
```

3. Indítsa el az alkalmazást:
```bash
pnpm run start
```

## Hibaelhárítás

- Ellenőrizze, hogy minden szükséges port elérhető-e
- Ellenőrizze a Docker konténerek állapotát: `docker-compose ps`
- Tekintse meg a logokat: `docker-compose logs -f`

## Támogatás

Ha bármilyen problémába ütközik, kérjük, nyisson egy issue-t a GitHub repository-ban.
