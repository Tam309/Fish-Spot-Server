import express from "express";
import { query } from "../helpers/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt as extractJwt } from "passport-jwt";


const userRouter = express.Router();

// const secretKey = process.env.SECRETKEY
// const jwtOptions = {}
// jwtOptions.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = secretKey;

// // Middleware for authorization
// passport.use(
//   new JwtStrategy(jwtOptions, function (jwt_payload, done) {
//     console.log("payload received", jwt_payload);
//     done(null, jwt_payload);
//   })
// )

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         user_name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Register
userRouter.post("/register", async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (!err) {
      const user_name = req.body.user_name;
      const email = req.body.email;
      const password = hash;
      try {
        const sql =
          "INSERT INTO users (user_name, password, email) VALUES ($1, $2, $3) RETURNING *";
        const result = await query(sql, [user_name, password, email]);
        const rows = result.rows ? result.rows : [];
        res.status(200).json({
          user_id: rows[0].user_id,
          user_name: user_name,
          email: email,
          avatar: rows[0].avatar,
        });
      } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error.message });
      }
    } else {
      res.statusMessage = err;
      res.status(500).json({ error: err.message });
    }
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */

// Login
userRouter.post("/login", async (req, res) => {
  try {
    const sql = "select * from users where user_name = $1";
    const result = await query(sql, [req.body.user_name]);
    if (result.rowCount === 1) {
      bcrypt.compare(
        req.body.password,
        result.rows[0].password,
        (err, bcrypt_res) => {
          if (!err) {
            console.log(bcrypt_res);
            if (bcrypt_res === true) {
              const user = result.rows[0];

              res.status(200).json({
                user_id: user.user_id,
                email: user.email,
                user_name: user.user_name,
              });
            } else {
              res.statusMessage = "Invalid login";
              res.status(401).json({ error: "Invalid login" });
            }
          } else {
            res.statusMessage = err;
            res.status(500).json({ error: err });
          }
        }
      );
    } else {
      res.statusMessage = "User not found";
      res.status(401).json({ error: "Invalid login" });
    }
  } catch (err) {
    res.statusMessage = err;
    res.status(500).json({ error: err });
  }
});

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Change a user's password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               password:
 *                 type: string
 *               new_pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_name:
 *                   type: string
 *                 message:
 *                   type: string
 */


// Change password
userRouter.put("/users/password", async (req, res) => {
  console.log(req.body);
  try {
    const sql = "SELECT * FROM users WHERE user_id=$1";
    const result = await query(sql, [req.body.user_id]);
    console.log(result.rowCount);
    console.log(req.body.password);
    console.log("This : " + result.rows[0].password);

    if (result.rowCount === 1) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(req.body.new_pass, 10);
        const new_sql =
          "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *";
        const newResult = await query(new_sql, [
          hashedPassword,
          req.body.user_id,
        ]);
        console.log(newResult.rows[0]);
        res.status(200).json({
          user_name: newResult.rows[0].user_name,
          message: "Password updated successfully",
        });
      } else {
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      res.status(401).json({ error: "User ID not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Get user's profile by user_id
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 */

//Get user's profile based on user_id
userRouter.get("/users/:user_id", async (req, res) => {
  const userId = req.params.user_id; // Get user_id from request parameters
  try {
    // Use parameterized query to prevent SQL injection
    const sql = `
            SELECT 
                users.nick_name, 
                users.bio, 
                users.avatar, 
                users.location, 
                users.user_id, 
                COUNT(posts.post_id) AS post_count
            FROM users
            LEFT JOIN posts ON users.user_id = posts.user_id
            WHERE users.user_id = $1
            GROUP BY users.user_id;
        `;

    // Execute the query with the userId parameter
    const result = await query(sql, [userId]);

    // Send the response
    const userData =
      result.rows && result.rows.length > 0 ? result.rows[0] : null;
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/edit/{user_id}:
 *   put:
 *     summary: Edit user's profile
 *     tags:
 *      - User
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nick_name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 */

//Edit user's profile
userRouter.put("/users/edit/:user_id", async (req, res) => {
  const user_id = Number(req.params.user_id);
  const nick_name = req.body.nick_name;
  const avatar = req.body.avatar;
  const location = req.body.location;
  const bio = req.body.bio;
  try {
    const result = await query(
      "UPDATE users SET nick_name =$1, avatar = $2, location =$3, bio =$4 WHERE user_id =$5 RETURNING *",
      [nick_name, avatar, location, bio, user_id]
    );
    const rows = result.rows ? result.rows : [];
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/avatar/{user_id}:
 *   get:
 *     summary: Get user's avatar by user_id
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User avatar URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 */

//Get user's avatar based on user Id
userRouter.get("/users/avatar/:user_id", async (req, res) => {
  const user_id = Number(req.params.user_id);
  try {
    const result = await query("SELECT avatar FROM users WHERE user_id = $1", [
      user_id,
    ]);
    const rows = result.rows ? result.rows : [];
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
export { userRouter };
