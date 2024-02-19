const redisClient = require('../redis');



/**
 * verifica se a chave existe no Redis.
 * @param {string} chave - a chave pra ser verificada no REDIS.
 * @returns {Promise<boolean>} uma Promise que resolve para true se a chave existe, senão false.
 */

async function existeNoRedis(chave) {
    return new Promise((resolve, reject) => {

        redisClient.exists(chave, (err, reply) => {
            if (err) {

                console.error(err);

                reject(err);

            } else {
                resolve(reply === 1);

            }
        });
    });
}



/**
 * salva um valor no Redis associado a chave.
 * @param {string} chave - a chave associada ao valor no Redis.
 * @param {any} valor - o valor a ser salvo no Redis.
 * @returns {Promise<void>} UmA Promise que resolve quando o valor é salvo no Redis.
 */
async function salvarNoRedis(chave, valor) {
    return new Promise((resolve, reject) => {
        redisClient.set(chave, JSON.stringify(valor), (err, reply) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("salvo no Redis");
                resolve();
            }
        });
    });
}



/**
 * define um tempo de expiração para uma chave no Redis.
 * @param {string} chave - a chave a ter um tempo de expiração definido no Redis.
 * @param {number} tempo - o tempo de expiraçÂo em segundos.
 * @returns {Promise<void>} Promise que resolve quando o tempo de expiração é definido no Redis.
 */
async function expirarLinkRedis(chave, tempo) {
    return new Promise((resolve, reject) => {
        redisClient.expire(chave, tempo, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(`chave expirada: ${chave}`);
                resolve();
            }
        });
    });
}

/**
 * busca um valor associado a uma chave no Redis.
 * @param {string} chave - a chave associada ao valor no Redis.
 * @returns {Promise<any>} UMa Promise que resolve para o valor associado a chave no Redis ou null se a chave não existir.
 */
async function obterDoRedis(chave) {
    return new Promise((resolve, reject) => {
        redisClient.get(chave, (err, reply) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const valor = JSON.parse(reply);
                resolve(valor);
            }
        });
    });
}


module.exports = {
    existeNoRedis,
    salvarNoRedis,
    expirarLinkRedis,
    obterDoRedis
};