import { DataTypes, Model, Relationships, Database } from 'https://deno.land/x/denodb/mod.ts';
import { User } from '../models/index.ts';

export default class RenewKey extends Model {
    static table: string = 'renew_keys';
    static timestamps: boolean = true;

    static fields: any = {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        key: { unique: true, type: DataTypes.STRING, allowNull: false },
        ip: { type: DataTypes.STRING, allowNull: false },
        userId: Relationships.belongsTo(User),
    };

    id!: number;
    key!: string;
    ip!: string;
    userId!: number;

    static user() {
        return this.hasOne(User);
    }
};