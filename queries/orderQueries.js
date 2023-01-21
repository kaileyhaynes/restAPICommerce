const { response } = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})


const getOrderDetails = (request, response) => {
  pool.query('SELECT * FROM order_details ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrderItems = (request, response) => {
  pool.query('SELECT * FROM order_items ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPaymentDetails = (request, response) => {
  pool.query('SELECT * FROM payment_details ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrderDetailById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM order_details WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrderItemById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM order_items WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPaymentDetailById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM payment_details WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createOrderDetail = (request, response) => {
  const { user_id, total, payment_id } = request.body

  pool.query('INSERT INTO order_details (user_id, total, payment_id) VALUES ($1, $2, $3) RETURNING *', [ user_id, total, payment_id ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Order detail added with ID: ${results.rows[0].id}`)
  })
}

const createOrderItem = (request, response) => {
  const { order_id, product_id, quantity } = request.body

  pool.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [ order_id, product_id, quantity ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Order item added with ID: ${results.rows[0].id}`)
  })
}

const createPaymentDetail = (request, response) => {
  const { order_id, amount, provider, status } = request.body

  pool.query('INSERT INTO payment_details (order_id, amount, provider, status) VALUES ($1, $2, $3, $4) RETURNING *', [ order_id, amount, provider, status ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Payment detail added with ID: ${results.rows[0].id}`)
  })
}

const updateOrderDetail = (request, response) => {
  const id = parseInt(request.params.id)
  const { user_id, total, payment_id } = request.body

  pool.query(
      'UPDATE order_details SET user_id = $1, total = $2, payment_id = $3 WHERE id = $4',
      [user_id, total, payment_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Order Detail modified with ID: ${id}`)
      }
    )
  }

const updateOrderItem = (request, response) => {
  const id = parseInt(request.params.id)
  const { order_id, product_id, quantity } = request.body

  pool.query(
      'UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4',
      [order_id, product_id, quantity],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Order Item modified with ID: ${id}`)
      }
    )
}

const updatePaymentDetail = (request, response) => {
  const id = parseInt(request.params.id)
  const { order_id, amount, provider, status } = request.body

  pool.query(
      'UPDATE payment_details SET order_id = $1, amount = $2, provider = $3, status = $4 WHERE id = $5',
      [order_id, amount, provider, status],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteOrderDetail = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM order_details WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Order Detail deleted with ID: ${id}`)
    })
  }

const deleteOrderItem = (request, response) => {
  const id = parseInt(request.params.id)
  
  pool.query('DELETE FROM order_items WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Order Item deleted with ID: ${id}`)
  })
}

const deletePaymentDetail = (request, response) => {
  const id = parseInt(request.params.id)
  
  pool.query('DELETE FROM payment_details WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Payment Detail deleted with ID: ${id}`)
  })
}

module.exports = {
getOrderDetails,
getOrderDetailById,
getOrderItems,
getOrderItemById,
getPaymentDetails,
getPaymentDetailById,
createOrderDetail,
createOrderItem,
createPaymentDetail,
updateOrderDetail,
updateOrderItem,
updatePaymentDetail,
deleteOrderDetail,
deleteOrderItem,
deletePaymentDetail
}