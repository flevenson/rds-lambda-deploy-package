const pg = require('pg');

const databaseUser = process.env.DB_USER;
const databasePassword = process.env.DB_PASSWORD;
const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseMaxCon = process.env.DB_MAX_CONNECTIONS;

exports.handler = (event, context, callback) => {
  console.log('Received Event');

  let dbConfig = {
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    host: databaseHost,
    port: databasePort,
    max: databaseMaxCon
  };

  let text = 'INSERT INTO users(username, password, user_token) VALUES($1, $2, $3) RETURNING id'
  let values = [event.username, event.password, event.user_token]


  let pool = new pg.Pool(dbConfig);
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to PG Server' + err.stack)
      callback(err)
    } else {
      console.log('Connection Established')
      client.query(text, values, (err, res) => {
        if(err){
          console.log('Error querying DB')
          console.log(err.stack)
          callback(err)
        } else {
          console.log(res.rows[0])
        }
        client.release()
        pool.end()
        console.log('Ending Lambda')
      })
    }
  })
}
