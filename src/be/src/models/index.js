'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: config.logging,
  timezone: config.timezone,
  dialectOptions: config.dialectOptions,
});

// Import all models
const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Manufacturer = require('./Manufacturer')(sequelize);
const DroneCategory = require('./DroneCategory')(sequelize);
const Drone = require('./Drone')(sequelize);
const Registration = require('./Registration')(sequelize);
const FlightZone = require('./FlightZone')(sequelize);
const FlightPermit = require('./FlightPermit')(sequelize);
const FlightLog = require('./FlightLog')(sequelize);
const Violation = require('./Violation')(sequelize);
const Inspection = require('./Inspection')(sequelize);
const Notification = require('./Notification')(sequelize);
const OtpCode = require('./OtpCode')(sequelize);
const LookupHistory = require('./LookupHistory')(sequelize);
const SystemSetting = require('./SystemSetting')(sequelize);

const db = {
  sequelize,
  Sequelize,
  Role,
  User,
  Manufacturer,
  DroneCategory,
  Drone,
  Registration,
  FlightZone,
  FlightPermit,
  FlightLog,
  Violation,
  Inspection,
  Notification,
  OtpCode,
  LookupHistory,
  SystemSetting,
};

// Run associations
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;
