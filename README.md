# Full Stack FastAPI, PostgreSQL, Neo4j & Nuxt 3 Base Project Generator

[![Build Status](https://app.travis-ci.com/whythawk/full-stack-fastapi-postgresql.svg?branch=master)](https://app.travis-ci.com/whythawk/full-stack-fastapi-postgresql)

Accelerate your next web development project with this FastAPI/Nuxt.js base project generator.

This project is a comprehensively updated fork of [Sebastián Ramírez's](https://github.com/tiangolo) [Full Stack FastAPI and PostgreSQL Base Project Generator](https://github.com/tiangolo/full-stack-fastapi-postgresql). FastAPI is updated to version 0.88 (November 2022), SQLAlchemy to version 1.4.45 (December 2022), and the frontend to Nuxt 3 (November 2022).

Generate a backend and frontend stack using Python, including interactive API documentation.

- [Screenshots](#screenshots)
- [Key features](#key-features)
- [How to use it](#how-to-use-it)
   - [Generate passwords](#generate-passwords)
   - [Input variables](#input-variables)
   - [Local development](#local-development)
   - [Starting Jupyter Lab](#starting-jupyter-lab)
- [How to deploy](#how-to-deploy)
- [Authentication with magic and TOTP](#authentication-with-magic-and-totp)
- [More details](#more-details)
- [Release notes](#release-notes)
- [License](#license)

## Screenshots

### App landing page

[![Landing page](img/landing.png)](https://github.com/whythawk/full-stack-fastapi-postgresql)

### Dashboard Login

[![Magic-link login](img/login.png)](https://github.com/whythawk/full-stack-fastapi-postgresql)

### Dashboard User Management

[![Moderator user management](img/dashboard.png)](https://github.com/whythawk/full-stack-fastapi-postgresql)

### Interactive API documentation

[![Interactive API docs](img/redoc.png)](https://github.com/whythawk/full-stack-fastapi-postgresql)

### Enabling two-factor security (TOTP)

[![Enabling TOTP](img/totp.png)](https://github.com/whythawk/full-stack-fastapi-postgresql)


## Key features

- **Docker Compose** integration and optimization for local development.
- **Authentication** user management schemas, models, crud and apis already built, with OAuth2 JWT token support & default hashing. Offers _magic link_ authentication, with password fallback, with cookie management, including `access` and `refresh` tokens.
- [**FastAPI**](https://github.com/tiangolo/fastapi) backend with [Inboard](https://inboard.bws.bio/) one-repo Docker images:
  - **SQLAlchemy** version 1.4 support for models.
  - **MJML** templates for common email transactions.
  - **Metadata Schema** based on [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#section-3) for inheritance.
  - **Common CRUD** support via generic inheritance.
  - **Standards-based**: Based on (and fully compatible with) the open standards for APIs: [OpenAPI](https://github.com/OAI/OpenAPI-Specification) and [JSON Schema](http://json-schema.org/).
  - [**Many other features**]("https://fastapi.tiangolo.com/features/"): including automatic validation, serialization, interactive documentation, etc.
- [**Nuxt/Vue 3**](https://nuxt.com/) frontend:
  - **Authorisation** via middleware for page access, including logged in or superuser.
  - **Model blog** project, with [Nuxt Content](https://content.nuxtjs.org/) for writing Markdown pages.
  - **Form validation** with [Vee-Validate 4](https://vee-validate.logaretm.com/v4/).
  - **State management** with [Pinia](https://pinia.vuejs.org/), and persistance with [Pinia PersistedState](https://prazdevs.github.io/pinia-plugin-persistedstate/).
  - **CSS and templates** with [TailwindCSS](https://tailwindcss.com/), [HeroIcons](https://heroicons.com/), and [HeadlessUI](https://headlessui.com/).
- **PostgreSQL** database.
- **PGAdmin** for PostgreSQL database management.
- **Celery** worker that can import and use models and code from the rest of the backend selectively.
- **Flower** for Celery jobs monitoring.
- **Neo4j** graph database, including integration into the FastAPI base project.
- Load balancing between frontend and backend with **Traefik**, so you can have both under the same domain, separated by path, but served by different containers.
- Traefik integration, including Let's Encrypt **HTTPS** certificates automatic generation.
- GitLab **CI** (continuous integration), including frontend and backend testing.

## How to use it

Go to the directory where you want to create your project and run:

```bash
pip install cookiecutter
cookiecutter https://github.com/whythawk/full-stack-fastapi-postgresql
```

### Generate passwords

You will be asked to provide passwords and secret keys for several components. Open another terminal and run:

```bash
openssl rand -hex 32
# Outputs something like: 99d3b1f01aa639e4a76f4fc281fc834747a543720ba4c8a8648ba755aef9be7f
```

Copy the contents and use that as password / secret key. And run that again to generate another secure key.


### Input variables

The generator (cookiecutter) will ask you for some data, you might want to have at hand before generating the project.

The input variables, with their default values (some auto generated) are:

- `project_name`: The name of the project
- `project_slug`: The development friendly name of the project. By default, based on the project name
- `domain_main`: The domain in where to deploy the project for production (from the branch `production`), used by the load balancer, backend, etc. By default, based on the project slug.
- `domain_staging`: The domain in where to deploy while staging (before production) (from the branch `master`). By default, based on the main domain.
- `domain_base_api_url`: The domain url used by the frontend app for backend api calls. If deploying a localhost development environment, likely to be `http://localhost/api/v1`
- `domain_base_ws_url`: The domain url used by the frontend app for backend websocket calls. If deploying a localhost development environment, likely to be `ws://localhost/api/v1`

- `docker_swarm_stack_name_main`: The name of the stack while deploying to Docker in Swarm mode for production. By default, based on the domain.
- `docker_swarm_stack_name_staging`: The name of the stack while deploying to Docker in Swarm mode for staging. By default, based on the domain.

- `secret_key`: Backend server secret key. Use the method above to generate it.
- `totp_secret_key`: Two-factor security (TOTP) server secret key.
- `first_superuser`: The first superuser generated, with it you will be able to create more users, etc. By default, based on the domain.
- `first_superuser_password`: First superuser password. Use the method above to generate it.
- `backend_cors_origins`: Origins (domains, more or less) that are enabled for CORS (Cross Origin Resource Sharing). This allows a frontend in one domain (e.g. `https://dashboard.example.com`) to communicate with this backend, that could be living in another domain (e.g. `https://api.example.com`). It can also be used to allow your local frontend (with a custom `hosts` domain mapping, as described in the project's `README.md`) that could be living in `http://dev.example.com:8080` to communicate with the backend at `https://stag.example.com`. Notice the `http` vs `https` and the `dev.` prefix for local development vs the "staging" `stag.` prefix. By default, it includes origins for production, staging and development, with ports commonly used during local development by several popular frontend frameworks (Vue with `:8080`, React, Angular).
- `smtp_port`: Port to use to send emails via SMTP. By default `587`.
- `smtp_host`: Host to use to send emails, it would be given by your email provider, like Mailgun, Sparkpost, etc.
- `smtp_user`: The user to use in the SMTP connection. The value will be given by your email provider.
- `smtp_password`: The password to be used in the SMTP connection. The value will be given by the email provider.
- `smtp_emails_from_email`: The email account to use as the sender in the notification emails, it could be something like `info@your-custom-domain.com`.
- `smtp_emails_from_name`: The email account name to use as the sender in the notification emails, it could be something like `Symona Adaro`.
- `smtp_emails_to_email`: The email account to use as the recipient for `contact us` emails, it could be something like `requests@your-custom-domain.com`.

- `postgres_password`: Postgres database password. Use the method above to generate it. (You could easily modify it to use MySQL, MariaDB, etc).
- `pgadmin_default_user`: PGAdmin default user, to log-in to the PGAdmin interface.
- `pgadmin_default_user_password`: PGAdmin default user password. Generate it with the method above.

- `neo4j_password`: Neo4j database password. Use the method above to generate it.

- `traefik_constraint_tag`: The tag to be used by the internal Traefik load balancer (for example, to divide requests between backend and frontend) for production. Used to separate this stack from any other stack you might have. This should identify each stack in each environment (production, staging, etc).
- `traefik_constraint_tag_staging`: The Traefik tag to be used while on staging.
- `traefik_public_constraint_tag`: The tag that should be used by stack services that should communicate with the public.

- `flower_auth`: Basic HTTP authentication for flower, in the form`user:password`. By default: "`admin:changethis`".

- `sentry_dsn`: Key URL (DSN) of Sentry, for live error reporting. You can use the open source version or a free account. E.g.: `https://1234abcd:5678ef@sentry.example.com/30`.

- `docker_image_prefix`: Prefix to use for Docker image names. If you are using GitLab Docker registry it would be based on your code repository. E.g.: `git.example.com/development-team/my-awesome-project/`.
- `docker_image_backend`: Docker image name for the backend. By default, it will be based on your Docker image prefix, e.g.: `git.example.com/development-team/my-awesome-project/backend`. And depending on your environment, a different tag will be appended ( `prod`, `stag`, `branch` ). So, the final image names used will be like: `git.example.com/development-team/my-awesome-project/backend:prod`.
- `docker_image_celeryworker`: Docker image for the celery worker. By default, based on your Docker image prefix.
- `docker_image_frontend`: Docker image for the frontend. By default, based on your Docker image prefix.

### Local development

Once the Cookiecutter script has completed, you will have a folder populated with the base project and all input variables customised. 

Change into the project folder and run the `docker compose` script to build the project containers:

```bash
docker compose build --no-cache
```

And start them:

```bash
docker compose up -d 
```

**NOTE:** I find that the **Nuxt** container does not run well in development mode, and does not refresh on changes. In particular, `nuxt/content` is very unpredictable in dev mode running in the container. It is far better to run the `frontend` outside of the container to take advantage of live refresh.

Change into the `/frontend` folder, and:

```bash
yarn install
yarn dev
```

Be careful about the version of `Node.js` you're using. As of today (December 2022), the latest Node version supported by Nuxt is 16.18.1.

You can then view the frontend at `http://localhost:3000` and the backend api endpoints at `http://localhost/redoc`.

FastAPI `backend` updates will refresh automatically, but the `celeryworker` container must be restarted before changes take effect.

### Starting Jupyter Lab

If you like to do algorithmic development and testing in Jupyter Notebooks, then launch the `backend` terminal and start Jupyter as follows:

```bash
docker compose exec backend bash
```

From the terminal:

```bash
$JUPYTER
```

Copy the link generated into your browser and start.

**NOTE:** Notebooks developed in the container are not saved outside, so remember to copy them for persistence. You can do that from inside Jupyter (download), or:

```bash
docker cp <containerId>:/file/path/within/container /host/path/target
```

## How to deploy

This stack can be adjusted and used with several deployment options that are compatible with Docker Compose, but it is designed to be used in a cluster controlled with pure Docker in Swarm Mode with a Traefik main load balancer proxy handling automatic HTTPS certificates, using the ideas from <a href="https://dockerswarm.rocks" target="_blank">DockerSwarm.rocks</a>.

Please refer to <a href="https://dockerswarm.rocks" target="_blank">DockerSwarm.rocks</a> to see how to deploy such a cluster in 20 minutes.

## Authentication with magic and TOTP

> Any custodial changes to user-controlled information must be treated as requiring full authentication. Do **not** assume that a logged-in user is the authorised account holder.

Most web applications permit account recovery through requesting a password reset via email. This has process has been hardened using dual JWT tokens, and is offered as a primary authentication method, with password fallback.

Time-based One-Time Password (TOTP) authentication extends the login process to include a challenge-response component where the user needs to enter a time-based token after their preferred login method.

For development, you may prefer to use login and password.

## More details

After using this generator, your new project (the directory created) will contain an extensive `README.md` with instructions for development, deployment, etc. You can pre-read [the project `README.md` template here too](./{{cookiecutter.project_slug}}/README.md).

## Release Notes

### 0.7.0

- New feature: magic (email-based) login, with password fallback
- New feature: Time-based One-Time Password (TOTP) authentication
- Security enhancements to improve consistency, safety and reliability of the authentication process (see full description in the frontend app)
- Requires one new `frontend` dependency: [QRcode.vue](https://github.com/scopewu/qrcode.vue)

### 0.6.1

- Corrected error in variable name `ACCESS_TOKEN_EXPIRE_SECONDS`

### 0.6.0

- Inboard 0.10.4 -> 0.37.0, including FastAPI 0.88
- SQLAlchemy 1.3 -> 1.4
- Authentication refresh token tables and schemas for long-term issuing of a new access token.
- Postgresql 12 -> 14
- Neo4j pinned to 5.2.0
- Nuxt.js 2.5 -> 3.0
- Pinia for state management (replaces Vuex)
- Vee-Validate 3 -> 4
- Tailwind 2.2 -> 3.2

[Historic changes from original](https://github.com/tiangolo/full-stack-fastapi-postgresql#release-notes)

## License

This project is licensed under the terms of the MIT license.
