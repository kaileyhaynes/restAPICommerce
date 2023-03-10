const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})

const getCartItems = (request, response) => {
  pool.query('SELECT * FROM cart_item ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCartItemById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM cart_item WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSessionById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT id, user_id, total FROM shopping_session WHERE id = $1', [id], (error, results) => {
    if(error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getTotal = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT total FROM shopping_session WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    //might have to return total
    response.status(200).json(results.rows)
  })
}

//when linked to a client, remember to send session_id and product_id
const createCartItem = (request, response) => {
  const { session_id, product_id, quantity } = request.body

  pool.query('INSERT INTO cart_item (session_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [session_id, product_id, quantity], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Cart Item added with ID: ${results.rows[0].id}`)
  })
}

const createSession = (request, response) => {
  //create session; += total from cartItems
  const { user_id, total } = request.body;

  pool.query('INSERT INTO shopping_session (user_id, total) VALUES ($1, $2) RETURNING *', [user_id, total], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Session created with ID: ${results.rows[0].id}`)
  })
}


//make sure to carry all elements w/ modification to stop accidentally modifying unexpected elements
const updateCartItem = (request, response) => {
  const id = parseInt(request.params.id)
  const { session_id, product_id, quantity } = request.body

  pool.query(
    //might have to retrive a global session_id
      'UPDATE cart_item SET session_id = $1, product_id = $2, quantity = $3 WHERE id = $4',
      [session_id, product_id, quantity, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Cart Item modified with ID: ${id}`)
      }
    )
  }

const deleteCartItem = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM cart_item WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Cart Item deleted with ID: ${id}`)
    })
  }

const deleteSession = (request, response) => {
  //delete local session
  const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM shopping_session WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Session deleted with ID: ${id}`)
    })
}

module.exports = {
getCartItems,
getCartItemById,
getTotal,
createCartItem,
updateCartItem,
deleteCartItem,
getSessionById,
createSession,
deleteSession
}