const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const client = new MongoClient(
    "mongodb://localhost:27017"
);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("restaurantDB");
    console.log("Connected to MongoDB!");
}

connectDB();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/restaurants", async (req, res) => {
    try {
        const {
            borough,
            cuisine,
            grade,
            maxScore
        } = req.query;

        const pipeline = [];

        // Borough and Cuisine filter
        const matchStage = {};

        if (borough) {
            matchStage.borough = borough;
        }

        if (cuisine) {
            matchStage.cuisine = cuisine;
        }

        if (borough || cuisine) {
            pipeline.push({
                $match: matchStage
            });
        }

        // Separate each grade record
        pipeline.push({
            $unwind: "$grades"
        });

        // Grade and Maximum Score filter
        if (grade || maxScore) {
            const gradeMatch = {};

            if (grade) {
                gradeMatch["grades.grade"] = grade;
            }

            if (maxScore) {
                gradeMatch["grades.score"] = {
                    $lte: Number(maxScore)
                };
            }

            pipeline.push({
                $match: gradeMatch
            });
        }

        // Select fields to display
        pipeline.push({
            $project: {
                _id: 0,
                restaurant_id: 1,
                name: 1,
                borough: 1,
                cuisine: 1,
                address: 1,
                grade: "$grades.grade",
                score: "$grades.score"
            }
        });

        // Sort alphabetically by restaurant name
        pipeline.push({
            $sort: {
                name: 1
            }
        });

        const restaurants = await db
            .collection("restaurants")
            .aggregate(pipeline)
            .toArray();

        res.json(restaurants);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to retrieve restaurants"
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});