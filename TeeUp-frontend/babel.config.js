module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Expo 사용 시
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};