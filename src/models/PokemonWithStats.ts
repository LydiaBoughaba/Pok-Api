import { Species } from "./Species";
import { Stat } from "./Stat";

export class PokemonWithStats {
  constructor(
    private id: number,
    private name: string,
    private height: number,
    private base_experience: number,
    private averageBaseExperience: number,
    private sprite_img: string,
    private species: Species,
    private url: string,
    private stats: Array<Stat>
  ) {}
}
