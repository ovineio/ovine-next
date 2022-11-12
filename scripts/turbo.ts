import { PATHS } from './.internal/constants';
import { spawnSync } from './.internal/utils';

(async () => {
  const args = process.argv.slice(2);

  // no cache
  if (args.includes('--no-cache')) {
    args.unshift('--force');
  }

  // filter
  if (!args.includes('--filter')) {
    // Tips: should use double quotes, single quotes are not valid on windows.
    args.unshift('--filter', `"./packages/*"`);
  }

  // turbo cache
  if (!args.includes('--cache-dir')) {
    args.unshift('--cache-dir', `".turbo"`);
  }

  // 清理 jest 缓存
  if (args.includes('test') && args.includes('--clearCache')) {
    spawnSync(`jest --clearCache`, { cwd: PATHS.ROOT });
  }

  const command = `turbo run ${args.join(' ')}`;

  spawnSync(command, { cwd: PATHS.ROOT });
})();
