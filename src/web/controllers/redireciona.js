const Link = require('../models/linkModel.js');
// const mongoose = require('mongoose');
const redisClient = require('../redis');

module.exports = async function (req, res) {

    let urlpequena = req.params.urlpequena;

    redisClient.get(urlpequena, async (err, resultado) => {

        console.log("busca no redis");

        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar no Redis');
        } else {



            if (resultado) {


                console.log("achou resultado no redis")

                let valorEmJson = JSON.parse(resultado);

                try {
                    res.redirect(valorEmJson.linkGrande);

                    let visitsATT = valorEmJson.visits += 1;

                    redisClient.set(urlpequena, JSON.stringify(valorEmJson), (err, reply) => {
                        if (err) {
                            console.log(err);
                        } else {

                            console.log('JSON salvo no Redis:', reply);

                            redisClient.expire(urlpequena, 60, async (err) => {

                                try {


                                    await Link.updateOne({ LinkShort: urlpequena }, { $inc: { visits: 1 } });


                                    const linkEncontrado = await Link.findOne({ LinkShort: urlpequena }, { _id: 0, __v: 0 });
                                    
                                    console.log(linkEncontrado)
                                    
                                    //problemas aqui
                
                                    //preciso salvar no mongodb depois de hit cache



                                } catch (err) {

                                    console.error("Erro ao atualizar no MongoDB:", err);


                                }


                            });


                        }
                    });






                } catch (err) {
                    console.log(err);
                }
            } else {

                console.log("nao achou no redis")

                try {

                    const linkEncontrado = await Link.findOne({ LinkShort: urlpequena }, { _id: 0, __v: 0 });

                    if (linkEncontrado) {

                        console.log(`CHAVE ENCONTRADA no mongodb ${linkEncontrado}`);

                        res.redirect(linkEncontrado.linkGrande);

                        //joga pra cache 

                        linkEncontrado.visits++


                        redisClient.set(urlpequena, JSON.stringify(linkEncontrado), async (err, reply) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('foi add no cache:', reply);

                                await redisClient.expire(urlpequena, 60, async(err) => {

                                    if (err) {

                                        console.error(err);

                                    } else {



                                        try {

                                            await Link.updateOne({ LinkShort: urlpequena }, { $inc: { visits: 1 } });


                                            const linkEncontrado = await Link.findOne({ LinkShort: urlpequena }, { _id: 0, __v: 0 });
                                            
                                            console.log(`salvo no mongo db ${linkEncontrado}`)

            



                                        } catch (err) {

                                            console.error("Erro ao atualizar no MongoDB:", err);


                                        }





                                    }
                                });
                            }
                        });













                    } else {
                        console.log(`Nenhum link encontrado para o LinkShort: ${urlpequena}`);

                        //pq faz o log:  Nenhum link encontrado para o LinkShort: favicon.ico ;????

                    }
                } catch (error) {

                    console.error('Erro ao buscar pelo LinkShort no Mongo:', error);

                    throw error;
                }
            }
        }
    });
};
