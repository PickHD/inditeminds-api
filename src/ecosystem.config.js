module.exports = {
  apps: [{
    name: "inditeminds-api",
    script: "./index.js",
    watch: true,
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
};
