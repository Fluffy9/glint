# Contributing

`main` stays deployable. Do the work on a short branch and squash-merge it.

Commit messages follow Conventional Commits: `feat`, `fix`, `docs`, `chore`, `test`. One concern per commit.

The pre-commit hook typechecks and runs `pnpm test`. Do not skip it.

Secrets stay in `.env`. Commit `.env.example` with names only. Do not commit `*.zip`.
