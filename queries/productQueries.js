const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'postgres',
  port: 5432,
})

const getProduct = (request, response) => {
    pool.query('SELECT * FROM product ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getProductById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM product WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getProductInventory = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT id, name, quantity FROM product WHERE id = $1', [id], (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json(results.rows);
    //return quantity
  })
}

const createProduct = (request, response) => {
    const { name, descr, price, quantity } = request.body
  
    pool.query('INSERT INTO product (name, descr, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *', [name, descr, price, quantity], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Product added with ID: ${results.rows[0].id}`)
    })
  }

const updateProduct = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, descr, price, quantity } = request.body

    pool.query(
        'UPDATE product SET name= $1, descr = $2, price = $3, quantity = $4 WHERE id = $5',
        [name, descr, price, quantity],
        (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).send(`Product modified with ID: ${id}`)
        }
      )
    }

const deleteProduct = (request, response) => {
      const id = parseInt(request.params.id)
    
      pool.query('DELETE FROM product WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Product deleted with ID: ${id}`)
      })
    }

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductInventory
}