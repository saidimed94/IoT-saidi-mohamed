const bluetooth = require('node-bluetooth');
const fetch = require("node-fetch");

function scanDevices() {
  console.log('-------------------')
  // create bluetooth device instance
  const device = new bluetooth.DeviceINQ();
  //device.listPairedDevices(console.log);
  device
    .on('finished', async (names , addresses)=>{

      try {
        const scandate = new Date().toISOString();
        const roomid = "Sala A";
        const count = addresses.length;
        const nameslist = names;
        const deviceid = "salaAsensor";
        console.log(nameslist);

        const body = {roomid,count,scandate, deviceid, nameslist};
        const response = await fetch("http://localhost:5000/scan",{
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(body)
        });

        const response1 = await fetch(
          `http://localhost:5000/scan/${roomid}`,
          {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
          }
      )
    
      } catch (error) {
          console.error(error.message);
      }


      }).scan();
}

setInterval(scanDevices, 5000);

