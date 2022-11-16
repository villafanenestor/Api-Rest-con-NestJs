import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {
  constructor(@InjectModel(
    Pokemon.name) private readonly pokemonModel: Model<Pokemon>
  ) { }

  private readonly axios: AxiosInstance = axios;


  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //Se eliminan todos los registros
    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');
    const insertPromiseArray: {nombre:string, numero: number }[] = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const nombre: string = name;
      const numero: number = Number(segments[segments.length - 2]);
      insertPromiseArray.push({ nombre, numero });

    });

    try {
      await this.pokemonModel.insertMany(insertPromiseArray);

    } catch (error) {
      console.log(error);
      if (error.code == 11000) {
        throw new Error('Metodo ya ejecutado');
      }
    }

    return 'Seed executed successfully';
  }
}
