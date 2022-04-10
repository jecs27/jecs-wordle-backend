module.exports = {
    port: process.env.PORT || 32712,
    DEV: process.env.DEV || true,
    dbName: process.env.DBNAME,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPWD,
    dbHost: process.env.DBHOST,
    dbDialect: process.env.DIALECT || 'postgres',
    token_key: process.env.SECRET_TOKEN || 'x[iHc#S)jnwB%fr-$*fh7)3]}q_?zC+8P[^#w+<F6HLGVw<ZJE:E9`J,t8KJ'
}