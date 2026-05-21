'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Manufacturer extends Model {
    static associate(models) {
      Manufacturer.hasMany(models.Drone, { foreignKey: 'manufacturer_id', as: 'drones' });
    }
  }

  Manufacturer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      support_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updatedAt',
      },
    },
    {
      sequelize,
      modelName: 'Manufacturer',
      tableName: 'Manufacturers',
      timestamps: true,
    }
  );

  return Manufacturer;
};
