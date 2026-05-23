async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user1@uavid.vn',
        password: 'User@123456'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData?.data?.token;

    const dronesRes = await fetch('http://localhost:5000/api/drones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dronesData = await dronesRes.json();
    if (dronesData?.data && dronesData.data.length > 0) {
      console.log("Drone Keys:", Object.keys(dronesData.data[0]));
      console.log("First Drone Raw JSON:", JSON.stringify(dronesData.data[0], null, 2));
    } else {
      console.log("No drones found.");
    }
  } catch (err) {
    console.error("API Error: ", err.message);
  }
}
testApi();
