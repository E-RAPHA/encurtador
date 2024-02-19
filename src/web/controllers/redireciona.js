const Link = require('../models/linkModel.js');
const redisClient = require('../redis');
const redisUtils = require("../utils/redisUtils.js")




async function incrementaVisitasNoMongoDB(urlpequena) {
    await Link.updateOne({ LinkShort: urlpequena }, { $inc: { visits: 1 } });
}


// async function adicionaNoCache(urlpequena) {
//     await redisClient.expire(urlpequena, 60);
// }

module.exports = async function (req, res) {
    try {
        let urlpequena = req.params.urlpequena;

        const resultado = await redisUtils.obterDoRedis(urlpequena);

        if (resultado) {

            console.log("achou resultado no redis\nCACHE HIT!!!");


            res.redirect(resultado.linkGrande);
            console.log("redirecionado pelo link encontrado no Rediss!")
            resultado.visits += 1;

            await incrementaVisitasNoMongoDB(urlpequena);
            await redisUtils.salvarNoRedis(urlpequena, resultado);
            await redisUtils.expirarLinkRedis(urlpequena, 60);//o nome nao é muito intuitivo, mas ta sendo colocado em cache.
        } else {
            console.log("nao achou no Redis");

            const linkEncontrado = await Link.findOne({ LinkShort: urlpequena }, { _id: 0, __v: 0 });

            if (linkEncontrado) {//se nao achar no mongodb FODEU KKKKK

                console.log(`chave encontrada no MongoDB ${linkEncontrado}`);
                res.redirect(linkEncontrado.linkGrande);
                console.log("redirecionado pelo link encontrado no mongodb")

                linkEncontrado.visits++;
                await redisUtils.salvarNoRedis(urlpequena, linkEncontrado);
                await redisUtils.expirarLinkRedis(urlpequena, 60);

            } else {
                console.log(`nenhum link encontrado para o LinkShort: ${urlpequena}`);
                res.send("nao existe o link :(")
            }
        }
    } catch (error) {
        console.error('erro no processamento!!!:', error);
        res.status(500).send('Erro no processamento');
    }
};
