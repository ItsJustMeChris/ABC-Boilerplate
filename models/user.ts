import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';
import { RenewKey } from '../models/index.ts';

export default class User extends Model {
    static table: string = 'users';
    static timestamps: boolean = true;

    static fields: any = {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        name: { unique: true, type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false }
    };

    id!: number;
    name!: string;
    password!: string;

    static renewKeys() {
        return this.hasMany(RenewKey);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }
};