

function alertaErro(erro) {


    Swal.fire({
        icon: "error",

        title: "Oops...",

        text: erro,

    });



}



let x = 1;

const canvas = document.getElementById('sim');
const jsConfetti = new JSConfetti({ target: canvas });





function enviarBtn() {

    let linkgrosso = document.getElementById("linkgrosso").value;

    axios.post("/", {

        biglink: linkgrosso

    }).then((response) => {



        if (response.status === 200) {

            jsConfetti.addConfetti({
                confettiColors: ['#87CEEB', '#FFB6C1', '#D8BFD8', "#ffffff"], // Amarelo, Azul Claro, Rosa Claro, Roxo Pastel

                confettiSource: { x: window.innerWidth / 2, y: -50, w: 10, h: 0 },
            });

            jsConfetti.addConfetti({
                emojis: ['🦄'],
                emojiSize: 100,
                confettiNumber: 30,
                confettiSource: { x: window.innerWidth / 2, y: -50, w: 10, h: 0 },
            })



            console.log(response.data)
            console.log(response.data.mensagem)
            console.log(response.data.linkMini)

            let linkMini = response.data.linkMini;

            let linkADM = response.data.LinkADM;


            //add mais coisa dps


            document.querySelector("#enviar").onclick = function clipboard() {

                let linkinhoInput = document.getElementById("linkgrosso");
                linkinhoInput.select();
                linkinhoInput.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(linkinhoInput.value);

            }

            document.querySelector("#enviar").innerHTML = "copiar"
            document.querySelector("#enviar").style.backgroundColor = 'green'
            document.querySelector("#enviar").style.color = "white"
            document.getElementById("linkgrosso").value = `${window.location.host}/${linkMini}`;



            let linkinhoInput = document.getElementById("linkgrosso");
            linkinhoInput.select();
            linkinhoInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(linkinhoInput.value);



            
            document.getElementById("linkAdm").innerHTML=`${window.location.host}/${linkMini}/${linkADM}`
            document.getElementById("linkAdm").href=`/${linkMini}/${linkADM}`
            document.querySelector(".adms").style.display = 'flex'

   




        }





    }).catch((err) => {

        console.log(err)

        console.log(err.response.data.erro)




        alertaErro(err.response.data.erro)



        // console.log(response.data.erro)





    }

    )


}




