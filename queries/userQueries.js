const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})


const checkRegistrationFields = require("../validation/register");
const bcrypt = require("bcryptjs");

/*
const registerUser = (req, res) => {

  // Ensures that all entries by the user are valid
  const { errors, isValid } = checkRegistrationFields(req.body);

  // If any of the entries made by the user are invalid, a status 400 is returned with the error
  if (!isValid) {
    return res.status(400).json(errors);
  }

  
  });
}
*/

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

//this is the register protocol rn
const createUser = (request, response) => {
    const { name, email, username, password } = request.body
  
    bcrypt.genSalt(12, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(request.body.password, salt, (err, hash) => {
        if (err) throw err;
        pool.query('INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, username, hash], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`User added with ID: ${results.rows[0].id}`)
        });
      });
    });
  }

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email, username, password } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2, username = $3, password = $4 WHERE id = $5',
        [name, email, username, password],
        (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).send(`User modified with ID: ${id}`)
        }
      )
    }

  const deleteUser = (request, response) => {
      const id = parseInt(request.params.id)
    
      pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
      })
    }

module.exports = {
  //registerUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}