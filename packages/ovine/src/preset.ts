export default () => {
  return {
    plugins: [
      require.resolve('@umijs/plugins/dist/antd'),
      require.resolve('@umijs/plugins/dist/locale'),
      require.resolve('@umijs/plugins/dist/mf'),
      // require.resolve('@ovine/plugin-amis'),
      // require.resolve('@ovine/plugin-amis-editor'),
      // require.resolve('@ovine/plugin-layout'),
      // require.resolve('@ovine/plugin-access'),
      // require.resolve('@ovine/plugin-request'),
      // require.resolve('@ovine/plugin-utils'),
      require.resolve('./plugins/ovine-alias'),
      require.resolve('./plugins/ovine-app-data'),
      require.resolve('./plugins/ovine-checker'),
    ],
  };
};
