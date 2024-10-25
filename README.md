# ictsv-internal

Internal tools for iCTSV

## Development guide

Just don't know how to spin up local version of this shi? Here are all the step to follow:

- Make sure you have NodeJS installed with an package manager. In this case, we use `pnpm`. Please use `pnpm` for world peace btw.
- Clone this repo
- Download Pocketbase from [this link](https://pocketbase.io/docs/). Try to figure out how to run/install whatever OS you use.
- Find anyway to spin up a Powershell/Bash session from Pocketbase folder, because this shi must be run in commandline environment.
- Copy `pb_migrations/` folder from repo directory and put it into Pocketbase directory.
- Run `pocketbase serve`, and copy the link after `Server started at`. For example, `http://127.0.0.1:8090`
- Come back to repo folder, paste the link above into `.env.example`. I know you are intelligent it to enough to know where and how to paste the link. Then rename it to `.env`
- Finally, spin up and code by running:

```sh
pnpm i
pnpm dev
```
