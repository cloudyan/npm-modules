// https://github.com/vuejs/core/blob/6b6889852f247a91df4793ad37e8e2e1d27c79b3/scripts/preinstall.js#L1

// scripts

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  )
  process.exit(1)
}
