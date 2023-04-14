const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

const pool = mysql.createPool(process.env.DATABASE_URL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.post("/Search.ejs", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows,fields] = await connection.execute("SELECT * FROM Restaurant");
        connection.release();
        const restaurants = rows.map(row => ({
          Rank: row.Rank,
          RestaurantName: row.RestaurantName
        }));

        if (req.body.search == "") {
            res.render("homepage", {result: restaurants,});
        } 
        else {
            let found = false;
            for (let i = 0; i < restaurants.length; i++) {
            if (restaurants[i].RestaurantName == req.body.search) {
                found = true;
                const connection2 = await pool.getConnection();
                const [rows2, fields] = await connection2.execute(`SELECT Restaurant.Rank, Restaurant.RestaurantName, Category.RestaurantType, Sales.Sales, Sales.YOY_Sales, Franchise.Units, Franchise.YOY_Units FROM Restaurant JOIN Category ON Restaurant.RestaurantID = Category.RestaurantID JOIN Sales ON Restaurant.RestaurantID = Sales.RestaurantID JOIN Franchise ON Restaurant.RestaurantID = Franchise.RestaurantID WHERE Restaurant.RestaurantName = '${req.body.search.replace("'", "''")}'`);
                connection2.release();
                const Final_result = rows2.map(row => ({
                    Rank: row.Rank,
                    RestaurantName: row.RestaurantName,
                    RestaurantType: row.RestaurantType,
                    Sales: row.Sales,
                    YOY_Sales: row.YOY_Sales,
                    Units: row.Units,
                    YOY_Units: row.YOY_Units
                }));
                res.render("Search", { result: Final_result });
                break;
            }
            }
            if (!found) {
            res.render("Search", { result: [] });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    }
});


app.get('/users', async(req, res) => {
    try {
        // Acquire a connection from the pool
        const connection = await pool.getConnection();
        // Execute the SQL query
        const [rows,fields] = await connection.execute('SELECT * FROM Restaurant');
        // Release the connection back to the pool
        connection.release();
        // Map the retrieved rows to a new array
        const restaurants = rows.map(row => ({
          Rank: row.Rank,
          RestaurantName: row.RestaurantName
        }));
        // Render the template with the retrieved data
        res.send(restaurants);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
});
  
app.get("/", async (req, res) => {
    try {
      // Acquire a connection from the pool
      const connection = await pool.getConnection();
      // Execute the SQL query
      const [rows,fields] = await connection.execute("SELECT `Rank`, `RestaurantName` FROM Restaurant ORDER BY `Rank`");
      // Release the connection back to the pool
      connection.release();
      // Map the retrieved rows to a new array
      const restaurants = rows.map(row => ({
        Rank: row.Rank,
        RestaurantName: row.RestaurantName
      }));
      // Render the template with the retrieved data
      res.render("homepage", { result: restaurants });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
});

app.get ( "/Category.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,Category.RestaurantType FROM Restaurant,Category Where Restaurant.RestaurantID = Category.RestaurantID");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              RestaurantType: row.RestaurantType,
            }));
            res.render ("Category", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
);

app.get ( "/R_Cat.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,Category.RestaurantType FROM Restaurant,Category Where Restaurant.RestaurantID = Category.RestaurantID");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              RestaurantType: row.RestaurantType
            }));
            res.render ("R_Cat", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/C_Cat.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,Category.RestaurantType FROM Restaurant,Category Where Restaurant.RestaurantID = Category.RestaurantID ORDER BY Category.RestaurantType");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              RestaurantType: row.RestaurantType,
            }));
            res.render ("C_Cat", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/Sales.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Sales`,`YOY_Sales` FROM Restaurant,Sales where Restaurant.RestaurantID = Sales.RestaurantID;");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              Sales: row.Sales,
              YOY_Sales: row.YOY_Sales
            }));
            res.render ("Sales", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/S_Sale.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Sales`,`YOY_Sales` FROM Restaurant,Sales where Restaurant.RestaurantID = Sales.RestaurantID;");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              Sales: row.Sales,
              YOY_Sales: row.YOY_Sales
            }));
            res.render ("S_Sale", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/Y_Sale.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Sales`,`YOY_Sales` FROM Restaurant,Sales where Restaurant.RestaurantID = Sales.RestaurantID order by Sales.YOY_Sales DESC;");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              Sales: row.Sales,
              YOY_Sales: row.YOY_Sales
            }));
            res.render ("Y_Sale", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/Franchise.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Units`,`YOY_Units` FROM Restaurant,Franchise where Restaurant.RestaurantID = Franchise.RestaurantID;");
            connection.release();
            const restaurants = rows.map(row => ({
              Rank: row.Rank,
              RestaurantName: row.RestaurantName,
              Units: row.Units,
              YOY_Units: row.YOY_Units
            }));
            res.render ("Franchise", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/U_Fran.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Units`,`YOY_Units` FROM Restaurant,Franchise where Restaurant.RestaurantID = Franchise.RestaurantID order by Franchise.Units DESC;");
            connection.release();
            const restaurants = rows.map(row => ({
                Rank: row.Rank,
                RestaurantName: row.RestaurantName,
                Units: row.Units,
                YOY_Units: row.YOY_Units
            }));
            res.render ("U_Fran", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/Y_Fran.ejs", async (req, res) =>
    {
        try {
            const connection = await pool.getConnection();
            const [rows,fields] = await connection.execute("SELECT `Rank`,`RestaurantName`,`Units`,`YOY_Units` FROM Restaurant,Franchise where Restaurant.RestaurantID = Franchise.RestaurantID order by Franchise.YOY_Units DESC;");
            connection.release();
            const restaurants = rows.map(row => ({
                Rank: row.Rank,
                RestaurantName: row.RestaurantName,
                Units: row.Units,
                YOY_Units: row.YOY_Units
            }));
            res.render ("Y_Fran", {result: restaurants,});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        }
    }
)

app.get ( "/Reference.ejs", function (req, res)
    {
        res.render ( "Reference" );
    }
)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});