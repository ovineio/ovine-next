export default () => {
  return {
    plugins: [
      require.resolve('@umijs/plugin-antd'),
      require.resolve('@ovine/plugin-amis'),
      require.resolve('@ovine/plugin-layout'),
      require.resolve('./plugins/ovine-alias'),
      require.resolve('./plugins/ovine-app-data'),
      require.resolve('./plugins/ovine-checker'),
    ],
  };
};
