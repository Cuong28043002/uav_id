'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FlightPermit extends Model {
    static associate(models) {
      FlightPermit.belongsTo(models.Drone, { foreignKey: 'drone_id', as: 'drone' });
      FlightPermit.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      FlightPermit.belongsTo(models.FlightZone, { foreignKey: 'zone_id', as: 'zone' });
      FlightPermit.hasMany(models.FlightLog, { foreignKey: 'permit_id', as: 'flightLogs' });
    }
  }

  FlightPermit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      drone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Drones', key: 'id' },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'FlightZones', key: 'id' },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
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
      modelName: 'FlightPermit',
      tableName: 'FlightPermits',
      timestamps: true,
    }
  );

  return FlightPermit;
};
