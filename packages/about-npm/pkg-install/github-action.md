# github action workflows

对于github action 不熟悉的读者，可以看[阮一峰老师 GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

- 配置文件 [workflows/release](https://github.com/antfu/install-pkg/blob/main/.github/workflows/release.yml)
- 构建历史 [github action workflow](https://github.com/antfu/install-pkg/runs/3773517075?check_suite_focus=true)

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
          registry-url: https://registry.npmjs.org/
      - run: npm i -g pnpm @antfu/ni
      - run: nci
      - run: nr test --if-present
      - run: npx conventional-github-releaser -p angular
        env:
          CONVENTIONAL_GITHUB_RELEASER_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

根据每次 tags 推送，执行。

```bash
# 全局安装 pnpm 和 ni
npm i -g pnpm @antfu/ni
```

```bash
# 如何存在 test 命令则执行
nr test --if-present
```

nci - clean install

```bash
nci
# npm ci
# 简单说就是不更新锁文件
# yarn install --frozen-lockfile
# pnpm install --frozen-lockfile
```

最后 `npx conventional-github-releaser -p angular`

- [conventional-github-releaser](https://www.npmjs.com/package/conventional-github-releaser)

生成 `changelog`。
