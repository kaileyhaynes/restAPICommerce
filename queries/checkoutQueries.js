const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})

const getUserAddresses = (request, response) => {
  pool.query('SELECT * FROM user_address ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserAddressById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM user_address WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserPayments = (request, response) => {
  pool.query('SELECT * FROM user_payment ORDER BY id ASC', (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const getUserPaymentById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM user_payment WHERE id = $1', [id], (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const createUserAddress = (request, response) => {
  const { user_id, address_line1, address_line2, city, postal_code, country, telephone } = request.body

  pool.query('INSERT INTO user_address (user_id, address_line1, address_line2, city, postal_code, country, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id, address_line1, address_line2, city, postal_code, country, telephone], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User Address added with ID: ${results.rows[0].id}`)
  })
}

//verify that the account_num is 16 digits long
const createUserPayment = (request, response) => {
  const { user_id, payment_type, provider, account_num, expire } = request.body;

  pool.query('INSERT INTO user_payment (user_id, payment_type, provider, account_num, expire) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, payment_type, provider, account_num, expire], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User Payment added with ID: ${results.rows[0].id}`)
  })
}

const updateUserAddress = (request, response) => {
  const id = parseInt(request.params.id)
  const { user_id, address_line1, address_line2, city, postal_code, country, telephone  } = request.body

  pool.query(
      'UPDATE user_address SET user_id = $1, address_line1 = $2, address_line2 = $3, city = $4, postal_code = $5, country = $6, telephone = $7 WHERE id = $8',
      [user_id, address_line1, address_line2, city, postal_code, country, telephone, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User Address modified with ID: ${id}`)
      }
    )
  }

const updateUserPayment = (request, response) => {
    const id = parseInt(request.params.id)
    const { user_id, payment_type, provider, account_num, expire } = request.body
  
    pool.query(
        'UPDATE user_payment SET user_id = $1, payment_type = $2, provider = $3, account_num = $4, expire = $5 WHERE id = $6',
        [user_id, payment_type, provider, account_num, expire, id],
        (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).send(`User Payment modified with ID: ${id}`)
        }
      )
    }

const deleteUserAddress = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM user_address WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User Address deleted with ID: ${id}`)
    })
  }

const deleteUserPayment = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM user_payment WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User Payment deleted with ID: ${id}`)
    })
  }

module.exports = {
getUserAddresses,
getUserAddressById,
getUserPayments,
getUserPaymentById,
createUserAddress,
createUserPayment,
updateUserAddress,
updateUserPayment,
deleteUserAddress,
deleteUserPayment
}