![logo da applicaçao](https://i.imgur.com/awfflBS.png)
# Sobre o encurtador de URL

Um encurtador de URL eficiente que utiliza MongoDB, Redis e implementa padrões como cache pattern e write behind.

## Tecnologias Utilizadas
- **MongoDB:** Banco de dados NoSQL para armazenamento persistente.
- **Redis:** Sistema de armazenamento em memória para caching rápido.
- **NodeJS:** Ambiente de execução JavaScript do lado do servidor, utilizado para construir a logica da aplicação.* 
- **Nginx:** Servidor web utilizado para gerenciar as solicitações, assim fazendo o Load Balancer.

## Instalação

1.   Baixe o Docker em [https://www.docker.com/](https://www.docker.com/)





2. Clone o repositório: `git clone https://github.com/e-rapha/encurtador`






## Como Usar

1. Inicie os containers e o servidor: `docker compose up`
2. Acesse o encurtador de URL através do navegador: `http://localhost`

## Padrões Implementados
- **Cache Pattern:** O cache pattern foi implementado da forma que o quando acessado o link, ele fica 60 segundos em memoria, isso significa que acessos subsequentes dentro desse periodo serão direcionados rapidamente do cache, melhorando significativamente o desempenho.


- **Write Behind:** Foi optada a abordagem de Write Behind para a gravação assíncrona de dados. Quando uma URL é encurtada, os dados são inicialmente gravados no Redis, proporcionando uma resposta rapida ao cliente. Em segundo plano, um processo assincrono grava os dados para o MongoDB para garantir persistencia dos dados.

# mapa do padrão
![mapa da applicaçao](https://i.imgur.com/jNvwwxI.png)

(Você pode olhar o cache do Redis em localhost:8001)


## Contribuição
- Fique à vontade para contribuir! entre em contato pra me falar sua ideia!👀

## Licença
Este projeto é licenciado sob a [MIT]. Veja o arquivo `LICENSE.md` para mais detalhes.

## Contato

- Se tiver dúvidas ou sugestões, entre em contato pelo contato@raphaelburad.com.br


##

- Caso você tenha gostado coloque uma ⭐  no projeto!











https://github.com/E-RAPHA/encurtador/assets/83914531/ffad4a3d-24f3-412e-8d50-29fc2337acd5

