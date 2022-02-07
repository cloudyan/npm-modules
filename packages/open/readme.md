<!-- 源码分析 Source code analysis，由 `pnpm create tpl sca` 生成 -->
# `open`

- https://www.npmjs.com/package/open
- https://github.com/sindresorhus/open#readme

参考好文

- 若川 https://juejin.cn/post/7026505183819464734

## 目标

- 作用
- 源码分析

## 作用

每次启动项目，自动打开默认浏览器

### 使用

webpack 中配置 [`devServer.open`](https://webpack.js.org/configuration/dev-server/#devserveropen) 在服务器启动后打开浏览器。 将其设置为 `true` 以打开您的默认浏览器。

```js
// webpack.config.js
module.exports = {
  //...
  devServer: {
    open: true,
  },
};
```

或

```bash
npx webpack serve --open
npx webpack serve --no-open
```

`webpack`、`vue-cli`和`create-react-app`，它们三者都有个特点就是不约而同的使用了`open`。

引用 open 分别的代码位置是：

- [webpack-dev-server](https://github.com/webpack/webpack-dev-server/blob/87401b4927c75f1c5114508216101fd1a3ec9e67/lib/Server.js#L2547)
- [vue-cli](https://github.com/vuejs/vue-cli/blob/v4/packages/%40vue/cli-shared-utils/lib/openBrowser.js#L9)
- [create-react-app](https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js#L13)

### 原理

在 npm 之王 [@sindresorhus](https://github.com/sindresorhus) 的 [open README文档](https://github.com/sindresorhus/open#readme)中，英文描述中写了为什么使用它的几条原因。

> 打开诸如 URL、文件、可执行文件之类的东西。
> 跨平台。

一句话概括 `open` 原理则是：针对不同的系统，使用`Node.js`的子进程 `child_process` 模块的`spawn`方法，调用系统的命令打开浏览器。

对应的系统命令简单形式则是：

```bash
# mac
open https://lxchuan12.gitee.io
# win
start https://lxchuan12.gitee.io
# linux
xdg-open https://lxchuan12.gitee.io
```

之前用过 mac 下的 open，这里学习到了 win 和 linux 下的命令格式

- Windows [start](https://docs.microsoft.com/zh-cn/windows-server/administration/windows-commands/start)

## 源码分析

```js
const path = require('path');
const childProcess = require('child_process');
const {promises: fs, constants: fsConstants} = require('fs');
const isWsl = require('is-wsl');
const isDocker = require('is-docker');
const defineLazyProperty = require('define-lazy-prop');

// Path to included `xdg-open`.
const localXdgOpenPath = path.join(__dirname, 'xdg-open');

const {platform, arch} = process;

/**
Get the mount point for fixed drives in WSL.
@inner
@returns {string} The mount point.
*/
const getWslDrivesMountPoint = (() => {
  // Default value for "root" param
  // according to https://docs.microsoft.com/en-us/windows/wsl/wsl-config
  const defaultMountPoint = '/mnt/';

  let mountPoint;

  return async function () {
    if (mountPoint) {
      // Return memoized mount point value
      return mountPoint;
    }

    const configFilePath = '/etc/wsl.conf';

    let isConfigFileExists = false;
    try {
      await fs.access(configFilePath, fsConstants.F_OK);
      isConfigFileExists = true;
    } catch {}

    if (!isConfigFileExists) {
      return defaultMountPoint;
    }

    const configContent = await fs.readFile(configFilePath, {encoding: 'utf8'});
    const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);

    if (!configMountPoint) {
      return defaultMountPoint;
    }

    mountPoint = configMountPoint.groups.mountPoint.trim();
    mountPoint = mountPoint.endsWith('/') ? mountPoint : `${mountPoint}/`;

    return mountPoint;
  };
})();

const pTryEach = async (array, mapper) => {
  let latestError;

  for (const item of array) {
    try {
      return await mapper(item); // eslint-disable-line no-await-in-loop
    } catch (error) {
      latestError = error;
    }
  }

  throw latestError;
};

// 核心代码
const baseOpen = async options => {
  options = {
    wait: false,
    background: false,
    newInstance: false,
    allowNonzeroExitCode: false,
    ...options
  };

  if (Array.isArray(options.app)) {
    return pTryEach(options.app, singleApp => baseOpen({
      ...options,
      app: singleApp
    }));
  }

  let {name: app, arguments: appArguments = []} = options.app || {};
  appArguments = [...appArguments];

  if (Array.isArray(app)) {
    return pTryEach(app, appName => baseOpen({
      ...options,
      app: {
        name: appName,
        arguments: appArguments
      }
    }));
  }

  let command;
  const cliArguments = [];
  const childProcessOptions = {};

  if (platform === 'darwin') {
    command = 'open';

    if (options.wait) {
      cliArguments.push('--wait-apps');
    }

    if (options.background) {
      cliArguments.push('--background');
    }

    if (options.newInstance) {
      cliArguments.push('--new');
    }

    if (app) {
      cliArguments.push('-a', app);
    }
  } else if (platform === 'win32' || (isWsl && !isDocker())) {
    const mountPoint = await getWslDrivesMountPoint();

    command = isWsl ?
      `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` :
      `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;

    cliArguments.push(
      '-NoProfile',
      '-NonInteractive',
      '–ExecutionPolicy',
      'Bypass',
      '-EncodedCommand'
    );

    if (!isWsl) {
      childProcessOptions.windowsVerbatimArguments = true;
    }

    const encodedArguments = ['Start'];

    if (options.wait) {
      encodedArguments.push('-Wait');
    }

    if (app) {
      // Double quote with double quotes to ensure the inner quotes are passed through.
      // Inner quotes are delimited for PowerShell interpretation with backticks.
      encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
      if (options.target) {
        appArguments.unshift(options.target);
      }
    } else if (options.target) {
      encodedArguments.push(`"${options.target}"`);
    }

    if (appArguments.length > 0) {
      appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
      encodedArguments.push(appArguments.join(','));
    }

    // Using Base64-encoded command, accepted by PowerShell, to allow special characters.
    options.target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
  } else {
    if (app) {
      command = app;
    } else {
      // When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
      const isBundled = !__dirname || __dirname === '/';

      // Check if local `xdg-open` exists and is executable.
      let exeLocalXdgOpen = false;
      try {
        await fs.access(localXdgOpenPath, fsConstants.X_OK);
        exeLocalXdgOpen = true;
      } catch {}

      const useSystemXdgOpen = process.versions.electron ||
        platform === 'android' || isBundled || !exeLocalXdgOpen;
      command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
    }

    if (appArguments.length > 0) {
      cliArguments.push(...appArguments);
    }

    if (!options.wait) {
      // `xdg-open` will block the process unless stdio is ignored
      // and it's detached from the parent even if it's unref'd.
      childProcessOptions.stdio = 'ignore';
      childProcessOptions.detached = true;
    }
  }

  if (options.target) {
    cliArguments.push(options.target);
  }

  if (platform === 'darwin' && appArguments.length > 0) {
    cliArguments.push('--args', ...appArguments);
  }

  const subprocess = childProcess.spawn(command, cliArguments, childProcessOptions);

  if (options.wait) {
    return new Promise((resolve, reject) => {
      subprocess.once('error', reject);

      subprocess.once('close', exitCode => {
        if (options.allowNonzeroExitCode && exitCode > 0) {
          reject(new Error(`Exited with code ${exitCode}`));
          return;
        }

        resolve(subprocess);
      });
    });
  }

  subprocess.unref();

  return subprocess;
};

const open = (target, options) => {
  if (typeof target !== 'string') {
    throw new TypeError('Expected a `target`');
  }

  return baseOpen({
    ...options,
    target
  });
};

const openApp = (name, options) => {
  if (typeof name !== 'string') {
    throw new TypeError('Expected a `name`');
  }

  const {arguments: appArguments = []} = options || {};
  if (appArguments !== undefined && appArguments !== null && !Array.isArray(appArguments)) {
    throw new TypeError('Expected `appArguments` as Array type');
  }

  return baseOpen({
    ...options,
    app: {
      name,
      arguments: appArguments
    }
  });
};

function detectArchBinary(binary) {
  if (typeof binary === 'string' || Array.isArray(binary)) {
    return binary;
  }

  const {[arch]: archBinary} = binary;

  if (!archBinary) {
    throw new Error(`${arch} is not supported`);
  }

  return archBinary;
}

function detectPlatformBinary({[platform]: platformBinary}, {wsl}) {
  if (wsl && isWsl) {
    return detectArchBinary(wsl);
  }

  if (!platformBinary) {
    throw new Error(`${platform} is not supported`);
  }

  return detectArchBinary(platformBinary);
}

const apps = {};

defineLazyProperty(apps, 'chrome', () => detectPlatformBinary({
  darwin: 'google chrome',
  win32: 'chrome',
  linux: ['google-chrome', 'google-chrome-stable', 'chromium']
}, {
  wsl: {
    ia32: '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    x64: ['/mnt/c/Program Files/Google/Chrome/Application/chrome.exe', '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe']
  }
}));

defineLazyProperty(apps, 'firefox', () => detectPlatformBinary({
  darwin: 'firefox',
  win32: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
  linux: 'firefox'
}, {
  wsl: '/mnt/c/Program Files/Mozilla Firefox/firefox.exe'
}));

defineLazyProperty(apps, 'edge', () => detectPlatformBinary({
  darwin: 'microsoft edge',
  win32: 'msedge',
  linux: ['microsoft-edge', 'microsoft-edge-dev']
}, {
  wsl: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}));

open.apps = apps;
open.openApp = openApp;

module.exports = open;
```

## 知识点

- Mac `open`
- Linux `xdg-open`
- Windows `start`
- `WSL` 适用于 Linux 架构的 Windows 子系统
  - https://docs.microsoft.com/en-us/windows/wsl/about
