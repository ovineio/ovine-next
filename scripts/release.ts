import * as logger from '@umijs/utils/dist/logger';
import { existsSync } from 'fs';
import getGitRepoInfo from 'git-repo-info';
import { join } from 'path';
import rimraf from 'rimraf';
import 'zx/globals';
import { PATHS } from './.internal/constants';
import { assert, eachPkg, getPkgs } from './.internal/utils';

(async () => {
  const { branch } = getGitRepoInfo();
  logger.info(`branch: ${branch}`);
  const pkgs = getPkgs(); // 获取所有packages/**文件夹名称
  logger.info(`pkgs: ${pkgs.join(', ')}`);

  // check git status
  // 检查是否存在未提交的代码，如果有未提交的代码，报错
  logger.event('check git status');
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');

  // check git remote update
  // 检查远程仓库，是否有未拉取的代码
  logger.event('check git remote update');
  await $`git fetch`;
  const gitStatus = (await $`git status --short --branch`).stdout.trim();
  assert(!gitStatus.includes('behind'), `git status is behind remote`);

  // check npm registry
  // 确认当前仓库地址为官方npm仓库
  logger.event('check npm registry');
  const registry = (await $`npm config get registry`).stdout.trim();
  assert(
    registry.indexOf('registry.npmjs.org') > -1,
    'npm registry is not registry.npmjs.org/',
  );

  // check package changed
  // 确认存在，当前版本有更改
  logger.event('check package changed');
  const changed = (await $`lerna changed --loglevel error`).stdout.trim();
  assert(changed, `no package is changed`);

  // check npm ownership
  // 确认 命令的执行者，是该npm包的 作者。
  // logger.event('check npm ownership');
  // const whoami = (await $`npm whoami`).stdout.trim();
  // try {
  //   await Promise.all(
  //     ['@ovine/next', 'create-ovine'].map(async (pkg) => {
  //       const owners = (await $`npm owner ls ${pkg}`).stdout
  //         .trim()
  //         .split('\n')
  //         .map((line) => {
  //           return line.split(' ')[0];
  //         });
  //       assert(owners.includes(whoami), `${pkg} is not owned by ${whoami}`);
  //     }),
  //   );
  // } catch (e: any) {
  //   // only throw ownership error
  //   if (e.message.includes('is not owned by')) {
  //     throw e;
  //   }
  // }

  // check package.json
  // 检查 npm 包代码的内容
  logger.event('check package.json info');
  await $`npm run check:packageFiles`;

  // clean
  // 清除 package/**/dist 代码
  logger.event('clean');
  eachPkg(pkgs, ({ dir, name }) => {
    logger.info(`clean dist of ${name}`);
    rimraf.sync(join(dir, 'dist'));
  });

  // build packages
  // 构建 package/**/src 代码
  logger.event('build packages');
  await $`npm run build:release`;

  // generate changelog
  // TODO
  logger.event('generate changelog');

  // bump version
  logger.event('bump version');
  await $`lerna version --exact --no-commit-hooks --no-git-tag-version --no-push --loglevel error`;
  const version = require(PATHS.LERNA_CONFIG).version;
  let tag = 'latest';
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.')
  ) {
    tag = 'next';
  }
  if (version.includes('-canary.')) tag = 'canary';

  // update example versions
  logger.event('update example versions');
  const examplesDir = PATHS.EXAMPLES;
  const examples = fs.readdirSync(examplesDir).filter((dir) => {
    return (
      !dir.startsWith('.') && existsSync(join(examplesDir, dir, 'package.json'))
    );
  });
  examples.forEach((example) => {
    const pkg = require(join(examplesDir, example, 'package.json'));
    pkg.scripts ||= {};
    pkg.scripts['start'] = 'npm run dev';
    // change deps version
    setDepsVersion({
      pkg,
      version,
      deps: ['@ovine/next', '@ovine/plugins'],
    });
    delete pkg.version;
    fs.writeFileSync(
      join(examplesDir, example, 'package.json'),
      `${JSON.stringify(pkg, null, 2)}\n`,
    );
  });

  // update pnpm lockfile
  logger.event('update pnpm lockfile');
  $.verbose = false;
  await $`pnpm i`;
  $.verbose = true;

  // commit
  logger.event('commit');
  await $`git commit --all --message "release: ${version}"`;

  // git tag
  if (tag !== 'canary') {
    logger.event('git tag');
    await $`git tag v${version}`;
  }

  // git push
  logger.event('git push');
  await $`git push origin ${branch} --tags`;

  // npm publish
  logger.event('pnpm publish');
  $.verbose = false;
  const innerPkgs = pkgs.filter((pkg) => !['ovine'].includes(pkg));

  // check 2fa config
  let otpArg: string[] = [];
  if (
    (await $`npm profile get "two-factor auth"`).toString().includes('writes')
  ) {
    let code = '';
    do {
      // get otp from user
      code = await question('This operation requires a one-time password: ');
      // generate arg for zx command
      // why use array? https://github.com/google/zx/blob/main/docs/quotes.md
      otpArg = ['--otp', code];
    } while (code.length !== 6);
  }

  await Promise.all(
    innerPkgs.map(async (pkg) => {
      await $`cd packages/${pkg} && npm publish --tag ${tag} ${otpArg}`;
      logger.info(`+ ${pkg}`);
    }),
  );

  await $`cd packages/ovine && npm publish --tag ${tag} ${otpArg}`;
  logger.info(`+ ovine`);
  $.verbose = true;

  // sync tnpm
  logger.event('sync tnpm');
  $.verbose = false;
  await Promise.all(
    pkgs.map(async (pkg) => {
      const { name } = require(path.join(PATHS.PACKAGES, pkg, 'package.json'));
      logger.info(`sync ${name}`);
      await $`tnpm sync ${name}`;
    }),
  );
  $.verbose = true;
})();

function setDepsVersion(opts: {
  deps: string[];
  pkg: Record<string, any>;
  version: string;
}) {
  const { deps, pkg, version } = opts;
  pkg.dependencies ||= {};
  deps.forEach((dep) => {
    if (pkg?.dependencies?.[dep]) {
      pkg.dependencies[dep] = version;
    }
    if (pkg?.devDependencies?.[dep]) {
      pkg.devDependencies[dep] = version;
    }
  });
  return pkg;
}
