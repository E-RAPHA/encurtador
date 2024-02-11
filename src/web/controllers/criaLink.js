//cria controlers/link.js

const Link = require('../models/linkModel.js')

const mongoose = require('mongoose');
const redisClient = require('../redis');




const secureRandom = require('secure-random');



function aleatorio(tamanho) {

    const bytesAleatorios = secureRandom(tamanho, { type: 'Buffer' });

    const caracteresAleatorios = bytesAleatorios.toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, tamanho);

    return caracteresAleatorios;


}





function addLink(chave, valor) {


    return new Promise((resolve, reject) => {


        try {

            redisClient.exists(chave, (err, reply) => {

                if (err) {

                    console.error(err)
                    reject(err);

                } else {

                    if (reply === 1) {

                        console.log(`ja existe nessa chave`);


                        let novaChave = aleatorio(8);

                        addLink(novaChave, valor)

                            .then(resolve)
                            .catch(reject);

                    } else {




                        redisClient.set(chave, JSON.stringify(valor), (err, reply) => {

                                if (err) {

                                    console.error(err);


                                } else {

                                    console.log("salvo no redis")



                                    redisClient.expire(chave, 60, (err) => {

                                        if (err) {
                                            console.error(err);
                                            reject(err);
                                        } else {
                                            resolve()


                                            //depois de ir pro cache do redis ele é escrito no mongo, tamo fazendo o write behind


                                            console.log(`chave salva: ${chave}`)
                                            console.log(valor)

                                            let novoLink = new Link({
                                                LinkAdm: valor.LinkAdm,
                                                linkGrande: valor.linkGrande,
                                                LinkShort: chave,
                                                visits: 0,
                                            });

                                            novoLink.save()
                                                .then(() => {
                                                    console.log('link salvo no mongodb');
                                                })
                                                .catch((err) => {
                                                    console.error('erro em salvar link no mongodb', err);
                                                })

                                        }
                                    });






                                }



                            })







                    }


                }

            })

        } catch (err) {

            console.log(err)

        }
    })

}










module.exports = async function (req, res) {


    try {



        let biglink = req.body.biglink.trim()

        console.log(`link recebido:${biglink}`)







        if (biglink.startsWith("http://") || biglink.startsWith("https://")) {



            let linkShort = aleatorio(8)

            let linkAdm = aleatorio(16)


            await addLink(linkShort,

                {
                    LinkAdm: linkAdm,

                    linkGrande: biglink,

                    LinkShort: linkShort,

                    visits: 0


                })


            res.status(200).json({ mensagem: `LINK CRIADO COM SUCESSO   !`, linkMini: linkShort, LinkADM: linkAdm })


        } else {
            
            res.status(500).json({ erro: `O link não é valido.` })

        }


    } catch (err) {

        res.status(500).json({ success: false, message: "Erro ao criar link curto." });


    }

}

