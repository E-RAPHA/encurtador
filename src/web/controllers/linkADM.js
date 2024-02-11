

module.exports = async function (req, res) {




    let urlpequena = req.params.urlpequena;

    let linkAdm = req.params.linkAdm;

    redisClient.get(urlpequena, async (err, resultado) => {




        if (err) {
            console.error(err);
            res.status(500).send('erro busca no redis');

        } else {
            if (resultado) {

                let resultadoJSON = JSON.parse(resultado)

                if (resultadoJSON.LinkAdm === linkAdm) {

                    res.render("adm", { jsonData: resultado })

                } else {

                    res.send('LINK NAO EXISTE OU TA EXPIRADO');


                }


            } else {



                //procura no mongodb e fé

                const linkEncontrado = await Link.findOne({ LinkShort: urlpequena }, { _id: 0, __v: 0 });

                if (linkEncontrado) {


                    res.render("adm", { jsonData: linkEncontrado })

                    redisClient.set(urlpequena, JSON.stringify(linkEncontrado), async (err, reply) => {


                        if (err) {
                            console.log(err);

                        } else {

                            console.log('foi add no cache: apos entrar na adm', reply);


                            await redisClient.expire(urlpequena, 60, async (err) => {

                                if (err) {
                                    console.log(err)
                                }

                            })


                        }
                    })
                } else {
                    res.send("nao foi encontrado")
                }









            }

        }

    })


}