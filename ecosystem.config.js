module.exports = {
    apps: [
        {
            name: 'sode-backend',
            script: 'start_backend.bat',
            interpreter: 'none',
            env: {
                SPRING_PROFILES_ACTIVE: 'dev'
            },
            autorestart: true,
            watch: false
        },
        {
            name: 'sode-ui',
            script: 'start_ui.bat',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production'
            },
            autorestart: true,
            watch: false
        }
    ]
};
