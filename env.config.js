module.exports = {
  apps : [{
    script    : "src/app.js",
    instances : "2",
    exec_mode : "cluster"
  }]
}