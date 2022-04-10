module.exports = {
    port: process.env.PORT || 32712,
    DEV: process.env.DEV || true,
    dbName: process.env.DBNAME || 'citas',
    dbUser: process.env.DBUSER || 'local',
    dbPassword: process.env.DBPWD || 'local',
    dbHost: process.env.DBHOST || 'localhost',
    dbDialect: process.env.DIALECT || 'postgres',
    token_key: process.env.SECRET_TOKEN || 'x[iHc#S)jnwB%fr-$*fh7)3]}q_?zC+8P[^#w+<F6HLGVw<ZJE:E9`J,t8KJ'
}