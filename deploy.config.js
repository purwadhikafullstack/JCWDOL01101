module.exports = {
  apps: [
    {
      name: "JCWDOL-011-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/dist/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3101,
      },
      time: true,
    },
  ],
};
