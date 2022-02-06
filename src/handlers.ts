import { FastifyRequest, FastifyReply } from "fastify";
import { PokemonWithStats } from "models/PokemonWithStats";

export async function getPokemonByName(request: FastifyRequest, reply: FastifyReply) {
  var name: string = request.params["name"];
  reply.headers["Accept"] = "application/json";
  var urlApiPokeman = `/api/v2/pokemon`;
  var hostname = "pokeapi.co";
  var params = {};

  name != null
    ? name.trim() != ""
      ? ((params["name"] = name),
        (urlApiPokeman = urlApiPokeman + "/"),
        (urlApiPokeman = urlApiPokeman + name))
      : ((urlApiPokeman = urlApiPokeman + "?offset=20"),
        (urlApiPokeman = urlApiPokeman + "&limit=20"))
    : ((urlApiPokeman = urlApiPokeman + "?offset=20"),
      (urlApiPokeman = urlApiPokeman + "&limit=20"));

  const https = require("https");

  let response: any = "";

  let req = https.request(
    { ...reply, ...{ host: hostname, path: urlApiPokeman, method: "GET" } },
    (result) => {
      let str = "";
      result.on("data", (data) => {
        str += data;
      });

      result.on("error", (error) => {
        console.log(error);
        reply.code(500).send(error);
      });

      result.on("end", () => {
        if (result.statusCode < 300 && result.statusCode >= 200) {
          response = JSON.parse(str);
          if(params["name"]){
            computeResponse(response, reply);
          } else {
            reply.send(response);
          }
        } else {
          reply.code(result.statusCode).send("Error");
        }
      });
    }
  );

  req.end();
}

export const computeResponse = async (response: any, reply: FastifyReply) => {
  let pokemon = new PokemonWithStats(
    response.id,
    response.name,
    response.height,
    response.base_experience,
    response.averageBaseExperience,
    response.sprites.front_default,
    response.species,
    `https://pokeapi.co/api/v2/pokemon/${response.id}`,
    response.stats
  );

  reply.send(pokemon);
};
