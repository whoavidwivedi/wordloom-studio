// Prepares a release: bumps every package version, checks CHANGELOG.md has notes
// for it, commits, and creates the annotated tag. Pushing is left to you, since
// pushing the tag is what publishes the GitHub release.
//
//   bun run release 1.2.0
//   git push origin main && git push origin v1.2.0

import { $ } from "bun"

const version = process.argv[2]?.replace(/^v/, "")
const fail = (message: string): never => {
  console.error(`release: ${message}`)
  process.exit(1)
}

if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  fail("pass a semver version, e.g. `bun run release 1.2.0` or `1.2.0-beta.1`")
}
const tag = `v${version}`

if ((await $`git status --porcelain --untracked-files=no`.text()).trim()) {
  fail("commit or stash tracked changes first")
}
if ((await $`git branch --show-current`.text()).trim() !== "main") {
  fail("release from main")
}
if ((await $`git tag --list ${tag}`.text()).trim()) {
  fail(`${tag} already exists`)
}

const changelog = await Bun.file("CHANGELOG.md").text()
if (!new RegExp(`^## ${version.replace(/\./g, "\\.")}(\\s|$)`, "m").test(changelog)) {
  fail(`add a "## ${version} (YYYY-MM-DD)" section to CHANGELOG.md; it becomes the release notes`)
}

for (const file of ["package.json", "web/next/package.json"]) {
  const pkg = await Bun.file(file).json()
  pkg.version = version
  await Bun.write(file, `${JSON.stringify(pkg, null, 2)}\n`)
}

await $`bunx oxfmt package.json web/next/package.json`.quiet()
await $`git add package.json web/next/package.json CHANGELOG.md`
await $`git commit -m ${`chore(release): ${tag}`}`
await $`git tag -a ${tag} -m ${`Wordloom ${tag}`}`

console.log(`\nTagged ${tag}. Publish it with:\n  git push origin main && git push origin ${tag}`)
