//arquico responsavel por criar links e salvar no redis/mongodb

const Link = require('../models/linkModel.js')


const redisClient = require('../redis');
const secureRandom = require('secure-random');


function aleatorio(tamanho) {

    const bytesAleatorios = secureRandom(tamanho, { type: 'Buffer' });

    const caracteresAleatorios = bytesAleatorios.toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, tamanho);

    return caracteresAleatorios;


}

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






async function addLink(chave, valor) {
    try {
        let existeChave = await existeNoRedis(chave);

        if (existeChave) {
            console.log(`ja existe nessa chave wtf!! `);

            let novaChave = aleatorio(8);

            await addLink(novaChave, valor);
            return;
        }

        await salvarNoRedis(chave, valor);

        await expirarLinkRedis(chave, 60);

        await salvarLinkNoMongoDB(chave, valor);

    } catch (err) {

        console.error(err);

        throw err;

    }
}


async function salvarLinkNoMongoDB(chave, valor) {
    try {
        let novoLink = new Link({
            LinkAdm: valor.LinkAdm,
            linkGrande: valor.linkGrande,
            LinkShort: chave,
            visits: 0,
        });

        await novoLink.save();

        console.log('link salvo no mongodb');

    } catch (err) {


        console.error('erro em salvar o link no mongoDB', err);

        throw err;
    }
}



module.exports = async function (req, res) {


    try {


        let biglink = req.body.biglink.trim()

        console.log(`link recebido:${biglink}`)


        if (biglink.startsWith("http://") || biglink.startsWith("https://")) {


            let chave = aleatorio(8)

            let linkAdm = aleatorio(16)



            let valor = {

                LinkAdm: linkAdm,

                linkGrande: biglink,

                LinkShort: chave,

                visits: 0


            }


            addLink(chave, valor)

                .then(() => {

                    res.status(200).json({
                        mensagem: `LINK CRIADO COM SUCESSO   !`,
                        
                        linkMini: chave,

                        LinkADM: linkAdm

                    })

                })
                .catch((err) => {

                    console.error("ocorreu erro:", err);

                    res.status(500).json({ erro: "Erro ao criar link curto." });
                });




        } else {

            res.status(500).json({ erro: `O link não é valido.` })

        }


    } catch (err) {

        console.error("ocorreu erro:", err);

    }


}

