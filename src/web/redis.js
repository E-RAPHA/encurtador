// redis.js

const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis',
    port: 6379
});



redisClient.on('connect', function () {
    console.log('Conectado ao Redis');
});


module.exports = redisClient;
