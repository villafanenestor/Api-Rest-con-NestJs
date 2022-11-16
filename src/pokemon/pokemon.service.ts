import {  BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { json } from 'stream/consumers';
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
      this.handleExceptions(error);
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

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon: Pokemon = await this.findOne(id);
      if (updatePokemonDto.nombre) {
        updatePokemonDto.nombre = updatePokemonDto.nombre.toLocaleLowerCase();
      }

      await this.pokemonModel.updateOne(updatePokemonDto);

      console.log(updatePokemonDto);
      console.log(pokemon);
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions(error);

    }

  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount==0){
      throw new NotFoundException('el id no existe');
    }

    return;
  }


  private handleExceptions(error: any){
    if(error.code=11000){
      throw new BadRequestException(`El parametro ${JSON.stringify(error.keyValue)} ya existe o duplicado`);
    }

    throw new InternalServerErrorException('Error al buscar pokemons');


  }
}
