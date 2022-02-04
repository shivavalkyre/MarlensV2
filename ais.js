const pool = require('./dbCon');

const readAISMessage = (request, response) => {
    //const { id } = request.body

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM ais_shipnamexshiplocationxstatusxgroup', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})

     var sql= 'SELECT * FROM ais_shipnamexshiplocationxstatusxgroup ORDER BY mmsi ASC'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
      })
})
}
module.exports = {
    readAISMessage,

  }