/** PM2 config for srvstage / VM-app. Usage: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: 'samanaffa-app',
      cwd: '/home/deploy/samanaffa-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '1G',
      error_file: '/home/deploy/samanaffa-app/logs/pm2-error.log',
      out_file: '/home/deploy/samanaffa-app/logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'samanaffa-worker',
      cwd: '/home/deploy/samanaffa-worker',
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'src/index.ts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        REDIS_URL: 'redis://127.0.0.1:6379',
      },
      max_memory_restart: '512M',
      error_file: '/home/deploy/samanaffa-worker/logs/pm2-error.log',
      out_file: '/home/deploy/samanaffa-worker/logs/pm2-out.log',
      merge_logs: true,
      time: true,
      autorestart: true,
    },
  ],
};
