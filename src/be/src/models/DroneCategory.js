'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DroneCategory extends Model {
    static associate(models) {
      DroneCategory.hasMany(models.Drone, { foreignKey: 'category_id', as: 'drones' });
    }
  }

  DroneCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      modelName: 'DroneCategory',
      tableName: 'DroneCategories',
      timestamps: true,
    }
  );

  return DroneCategory;
};
