import Sequelize from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class user extends Model {
  @Column({
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: Sequelize.DATE,
    allowNull: false,
  })
  birthday: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  email: string;
}
