const { createClient } = require('redis');
const redisClient = createClient({});

redisClient.on('connect', function() {
    console.log('Redis is connected');
});
redisClient.on('error', function(err) {
    console.log('Redis error.', err);
});
(async () => redisClient.connect())();

module.exports = redisClient;