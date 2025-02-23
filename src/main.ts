// TODO what needs to be don
// - create a cloudflare function handler
//    - denoflare init, resolve some issues with the version incompatibilities
//    - define .denoflare file, use environment variables from .env file
//    - denoflare push
//    - https://gh-starboy.jozef-cipa.workers.dev/

// - napojit github webhook
// - overit github payload
// - connect telegram sdk
// - put it all together

// Notes:
// denoflare setup troubleshooting: https://github.com/skymethod/denoflare/issues/77#issuecomment-2558179923

export default {
  fetch(request: Request): Response {
    return new Response('Hello, world!')
  },
}
