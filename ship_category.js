const pool = require('./dbCon');
const readShipCategory = (request, response) => {
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM marlens_ship_category', (error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})

     var sql= 'SELECT * FROM marlens_ship_category WHERE is_delete=false ORDER BY id ASC '
     pool.query(sql ,(error, results) => {
       if (error) {
        response.status(400).send({success:false,data: error})
        return;
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })

    })


  }

  module.exports = {
      readShipCategory,
  }