import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class User extends Model {
  static table: string = 'users';
  static timestamps: boolean = true;

  static fields: any = {
    id: { primaryKey: true, autoIncrement: true },
    name: { unique: true, type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  };
};