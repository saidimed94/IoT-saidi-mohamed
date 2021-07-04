const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");


////middleware
app.use(cors());
app.use(express.json()); // give us access to request.body and we can get json data
// we need to get data from the client side and the only way to do so is to get it from the request.body object



///// Routes

// Insert the scanned devices from sensors

app.post("/scan", async (req, res) => {
  try {
      const {roomid} = req.body;
      const {deviceid} = req.body;
      const {count} = req.body;
      const {scandate} = req.body;
      const {nameslist} = req.body;
      const newScan = await pool.query(
          "INSERT INTO public.roomlog (\"roomid\", \"deviceid\", \"scandate\", \"nameslist\", \"count\") VALUES($1, $2, $3, $4, $5) RETURNING *",
          [roomid, deviceid, scandate , nameslist, count]);
        // should also insert into the room table the count
      res.json(newScan.rows[0]);

      
        } catch (error) {
            console.error(error.message);
        }

});


// Update the Count, list and date of scanned devices from sensors

  app.put("/scan/:roomid", async (req, res) => {
    try {
      const { roomid } = req.params;
      const { count } = req.body;
      const { scandate } = req.body;
      const { nameslist } = req.body;
      const updatecount = await pool.query(
        "UPDATE public.room SET \"Count\" = $1, \"List\" = $2, \"Date\" = $3 WHERE \"RoomId\" = $4",[count, nameslist, scandate, roomid]);
      res.json("Count updated");

    } catch (error) {
      console.error(error.message);
    }
  });



// create a room from admin

app.post("/rooms", async (req, res) => {
    try {
        // we need to be able to get data from the client side to determine what exactly were willing to add
        //console.log("request.body");
        //console.log(req.body);
        const {RoomId} = req.body;
        const {MaxNumber} = req.body;
        const newRoom = await pool.query(
            "INSERT INTO public.room (\"RoomId\", \"MaxNumber\") VALUES($1, $2) RETURNING *",
            [RoomId, MaxNumber]);

        res.json(newRoom.rows[0]);



        
    } catch (error) {
        console.error(error.message);
    }

});

// get all rooms from admin
app.get("/rooms", async (req, res) => {
    try {
        const allrooms = await pool.query("SELECT * FROM room");
        res.json(allrooms.rows);
    } catch (error) {
        console.error(error.message);
    }
})


// get a specific room from admin

app.get("/rooms/:RoomId", async (req, res) => {
    try {
        const { RoomId } = req.params;
        const room = await pool.query("SELECT * FROM room WHERE \"RoomId\" = $1", [RoomId]);
        res.json(room.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})


// get a room list of current users from admin

app.get("/users/:RoomId", async (req, res) => {
  try {
      const { RoomId } = req.params;
      const avg = await pool.query("SELECT \"nameslist\" FROM public.roomlog WHERE \"roomid\" = $1 ORDER BY \"scandate\" LIMIT 1;", [RoomId]);
      res.json(avg.rows);
  } catch (error) {
      console.error(error.message);
  }
})



// get Stats from admin

app.get("/stats/:RoomId", async (req, res) => {
  try {
      const { RoomId } = req.params;
      const room = await pool.query("SELECT avg(\"count\") FROM public.roomlog WHERE \"roomid\" = $1 and \"scandate\" between current_timestamp - interval '1122 hours' and current_timestamp;", [RoomId]);
      res.json(room.rows[0]);
  } catch (error) {
      console.error(error.message);
  }
})



//update a room capacity from admin

app.put("/rooms/:RoomId", async (req, res) => {
    try {
      const { RoomId } = req.params;
      //const { RoomId } = req.body;
      const { MaxNumber } = req.body;
      const updateroom = await pool.query(
        "UPDATE room SET \"MaxNumber\" = $1 WHERE \"RoomId\" = $2",[MaxNumber, RoomId]);
      res.json("Room updated");

    } catch (error) {
      console.error(error.message);
    }
  });

// delete a room from admin

app.delete("/rooms/:RoomId", async (req, res) => {
    try {
      const { RoomId } = req.params;
      const deleteroom = await pool.query("DELETE FROM room WHERE \"RoomId\" = $1", [RoomId]);
      res.json("Room deleted");
    } catch (error) {
      console.log(error.message);
    }
  });



app.listen(5000, () => {
    console.log("server has started");
});
