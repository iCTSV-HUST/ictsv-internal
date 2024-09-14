// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
        interface Locals {
            pb: import('pocketbase').default;
            user: import('pocketbase').default['authStore']['model'];
        }

        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {};