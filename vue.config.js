module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: 'https://babyhealth.cfapps.eu10.hana.ondemand.com'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/BabyHealthWeb/'
    : '/'
};
