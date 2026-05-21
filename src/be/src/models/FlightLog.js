'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FlightLog extends Model {
    static associate(models) {
      FlightLog.belongsTo(models.Drone, { foreignKey: 'drone_id', as: 'drone' });
      FlightLog.belongsTo(models.FlightPermit, { foreignKey: 'permit_id', as: 'permit' });
    }
  }

  FlightLog.init(
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
      permit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'FlightPermits', key: 'id' },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      max_altitude: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Độ cao tối đa đạt được (m)',
      },
      distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Khoảng cách bay (km)',
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
      modelName: 'FlightLog',
      tableName: 'FlightLogs',
      timestamps: true,
    }
  );

  return FlightLog;
};
