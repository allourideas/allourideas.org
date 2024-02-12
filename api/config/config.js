module.exports = {
    "production": {
        "use_env_variable":"DATABASE_URL",
        "dialect":"postgres",
        "ssl":true,
        "dialectOptions":{
            "ssl":{
                "require":true,
                "rejectUnauthorized": false
            }
        }
    }
}
