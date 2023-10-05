module.exports = {
  apps : [{
    name : "hris_api",
    script    : "build/app.js",
    instances : "2",
    exec_mode : "cluster",
    increment_var : 'PORT',
  }]
}