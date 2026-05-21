'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Drone extends Model {
    static associate(models) {
      Drone.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
      Drone.belongsTo(models.Manufacturer, { foreignKey: 'manufacturer_id', as: 'manufacturer' });
      Drone.belongsTo(models.DroneCategory, { foreignKey: 'category_id', as: 'category' });
      Drone.hasMany(models.Registration, { foreignKey: 'drone_id', as: 'registrations' });
      Drone.hasMany(models.FlightPermit, { foreignKey: 'drone_id', as: 'flightPermits' });
      Drone.hasMany(models.FlightLog, { foreignKey: 'drone_id', as: 'flightLogs' });
      Drone.hasMany(models.Violation, { foreignKey: 'drone_id', as: 'violations' });
      Drone.hasMany(models.Inspection, { foreignKey: 'drone_id', as: 'inspections' });
    }
  }

  Drone.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      manufacturer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Manufacturers', key: 'id' },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'DroneCategories', key: 'id' },
      },
      model_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue('model_name');
        },
        set(value) {
          this.setDataValue('model_name', value);
        }
      },
      model: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue('model_name');
        },
        set(value) {
          this.setDataValue('model_name', value);
        }
      },
      serial_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Trọng lượng (kg)',
      },
      max_flight_height: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Độ cao bay tối đa (m)',
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
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
      modelName: 'Drone',
      tableName: 'Drones',
      timestamps: true,
    }
  );

  return Drone;
};
