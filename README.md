# ⭐ Github Starboy

> _A simple tool for sending Telegram notifications whenever your repo gets a
> new ⭐_

## How it works?

- cloudflare workers
- github events (+hmac)
  - if you want to use for more repos, just register the `star` webhook for all
    the repos that you want to track

- telegram bot & api

- findings

- denoflare seems to be outdated and doesn't keep up with the Deno (and
  Cloudflare) releases, so some things don't work and also it's limited in what
  it supports from Cloudflare, for instance doesn't seem to be possible to
  configure logging in `.denoflare` while there is a support for this in the
  official Wrangler tool
