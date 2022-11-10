import { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyConfig((memo) => {
    memo.alias = {
      ...memo.alias,
      '@ovine/next': '@@/exports',
    };
    return memo;
  });
};
