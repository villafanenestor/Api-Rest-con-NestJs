import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  nombre: string;
  @Prop({
    unique: true,
    index: true,
  })
  numero: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
