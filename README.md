# ictsv-internal

Internal tools for iCTSV

## Development guide

1. Make sure you have NodeJS installed with an package manager. This repo uses `pnpm` because we ran out of disk space with `npm`. If you don't have `pnpm` installed, follow the instructions [here](https://pnpm.io/installation).
2. Clone the repo
3. Download [Pocketbase](https://pocketbase.io/docs/). Then follow the instructions to install it on your machine.
4. Copy `pb_migrations/` folder from the repo to your Pocketbase directory.
5. Spin up a Powershell/Bash session from Pocketbase folder and run `pocketbase serve`. Setup your environment by copying the link after `Server started at ` (e.g. `http://127.0.0.1:8090`) and pasting it into both `PUBLIC_POCKETBASE_URL` and `PB_URL` in `.env.example`. Then rename it to `.env`
6. Finally, install required dependencies and run:

```sh
pnpm i
pnpm dev --open
```
