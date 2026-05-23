const { Drone, User, Manufacturer, DroneCategory, Registration } = require('c:/Users/Admin/Desktop/uav_id/src/be/src/models');

async function testQuery() {
  try {
    const { count, rows } = await Drone.findAndCountAll({
      where: { owner_id: 15 },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name', 'country'] },
        { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'identification_code', 'status', 'issue_date', 'qr_code_url'],
        },
      ],
      limit: 10,
      offset: 0,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
    console.log("Sequelize raw rows length:", rows.length);
    if (rows.length > 0) {
      const firstRow = rows[0];
      console.log("firstRow.registrations type:", typeof firstRow.registrations);
      console.log("Array.isArray(firstRow.registrations):", Array.isArray(firstRow.registrations));
      console.log("firstRow.registrations:", firstRow.registrations);
      console.log("Serialized JSON:", JSON.stringify(firstRow.toJSON(), null, 2));
    }
  } catch (err) {
    console.error("Error: ", err);
  } finally {
    process.exit();
  }
}
testQuery();
