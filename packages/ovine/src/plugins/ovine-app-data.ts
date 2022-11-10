import { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyAppData((memo) => {
    memo.umi.name = 'Ovine Next';
    memo.umi.importSource = '@ovine/next';
    memo.umi.cliName = 'ovine';
    return memo;
  });
};
