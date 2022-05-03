# degit

- https://www.npmjs.com/package/degit
- https://github.com/Rich-Harris/degit#readme

这个功能相当不错，是我想要的效果

不过私有仓库暂不支持，内网测试也不通

## 目标

- 作用
- 源码分析

## 作用

straightforward project scaffolding

简单的项目脚手架, 制作 git 存储库的副本

### 使用

默认使用 github master branch

```bash
npx degit user/repo#branch

# these commands are equivalent
degit github:user/repo
degit git@github.com:user/repo
degit https://github.com/user/repo
```

Or you can download from GitLab and BitBucket:

```bash
# download from GitLab
degit gitlab:user/repo
degit git@gitlab.com:user/repo
degit https://gitlab.com/user/repo

# download from BitBucket
degit bitbucket:user/repo
degit git@bitbucket.org:user/repo
degit https://bitbucket.org/user/repo

# download from Sourcehut
degit git.sr.ht/user/repo
degit git@git.sr.ht:user/repo
degit https://git.sr.ht/user/repo
```

Specify a tag, branch or commit

默认使用 master 分支, 可以指定分支、tag 或 commit

```bash
degit user/repo#dev       # branch
degit user/repo#v1.2.3    # release tag
degit user/repo#1234abcd  # commit hash
```

还支持创建新的项目目录

```bash
degit user/repo my-new-project
```

支持使用子目录

```bash
degit user/repo/subdirectory
```

可扩展

degit.json

```json
// degit.json
[
  {
    "action": "remove",
    "files": ["LICENSE"]
  }
]
```

### 私有仓库

私有仓库, **暂不支持**

- 内网 git 地址为 gitlab.xxx.com
- 项目地址为 /user/tpls/umi-h5

```bash
npx degit https://gitlab.xxx.com/user/tpls/umi-h5
```

暂不支持，欢迎 pull request

## 源码分析

