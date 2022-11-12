import { run } from 'umi';

process.env.DID_YOU_KNOW = 'none';

run({
  presets: [require.resolve('./preset')],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
