import {  BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService { 


  
  constructor(@InjectModel(
    Pokemon.name) private readonly pokemonModel: Model<Pokemon>
    ){}
  

    async create(createPokemonDto: CreatePokemonDto){
      
    try {
      const pokemon = await  this.pokemonModel.create( createPokemonDto );
      return pokemon; 
    } catch (error) {
      console.log(error);
      if(error.code==11000){
        throw new BadRequestException(`Pokemon ya existe en la base da datos`);
      }
      throw new InternalServerErrorException('Error al crear el pokemon ');
    }
  }

  findAll() {
  
    try {
      return this.pokemonModel.find();
      
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar pokemons');
    }
  }

  async findOne(id: string): Promise<Pokemon> {
    let pokemon: Pokemon; 
    if(!isNaN(+id)){
      pokemon = await this.pokemonModel.findOne({numero: id});
    }

    if(isValidObjectId(id)){
      pokemon = await this.pokemonModel.findById(id);
    }
    if( !pokemon){
      pokemon = await this.pokemonModel.findOne({nombre: id});
    }

    if( !pokemon){
      throw new NotFoundException('Pokemon not found');
    }
    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
