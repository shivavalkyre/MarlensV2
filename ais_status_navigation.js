const pool = require('./dbCon');




// access config var
process.env.TOKEN_SECRET;

/*
	will we need authentification or not ?
*/

  // get all ais status navigation
  const getAISStatusNavigation = (request, response) => {
    // const {page,rows} = request.body
    // var page_req = page || 1
    // var rows_req = rows || 3
    // var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    // pool.query('SELECT count(*) as total FROM tbl_insaf_ais_status_navigation', (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //  //console.log(results.rows[0].total)
    //  res.push({total:results.rows[0].total})

	 
    // })
	var sql= 'SELECT * FROM tbl_insaf_ais_status_navigation ORDER BY id ASC'
	pool.query(sql ,(error, results) => {
	  if (error) {
		throw error
	  }
	  items.push({rows:results.rows})
	  res.push(items)
	  response.status(200).send({success:true,data:res})
	})


  }

  const getAISStatusNavigationById = (request, response) => {
    const id = parseInt(request.params.id)
    // response.status(200).json(id)
    dbCon.query('SELECT * FROM tbl_insaf_ais_status_navigation WHERE id = $1', [id], (error, results) => {
      if (error) {
       throw error
  //      response.status(400).json({status:false,data:error})
      }
      response.status(200).json({status:true,data:results.rows})
    })
  }
  module.exports = {
    getAISStatusNavigation,
    getAISStatusNavigationById
  }