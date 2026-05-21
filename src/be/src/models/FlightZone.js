'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FlightZone extends Model {
    static associate(models) {
      FlightZone.hasMany(models.FlightPermit, { foreignKey: 'zone_id', as: 'flightPermits' });
    }
  }

  FlightZone.init(
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
      zone_type: {
        type: DataTypes.ENUM('forbidden', 'restricted', 'free'),
        allowNull: false,
      },
      coordinates: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'GeoJSON polygon hoặc mảng tọa độ [lat, lng]',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      zone_map_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Ảnh bản đồ / sơ đồ khu vực bay',
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
      modelName: 'FlightZone',
      tableName: 'FlightZones',
      timestamps: true,
    }
  );

  return FlightZone;
};
