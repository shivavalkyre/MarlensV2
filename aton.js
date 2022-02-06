const pool = require('./dbCon');

const createAton = (request, response) => {
    const {aton_type,aton_name,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,location,date_establish,owner,remark} = request.body
	pool.query('INSERT INTO tbl_aton_rep_aton (aton_type,aton_name,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,location,date_establish,owner,remark) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [zona_id,area,type_of_area,remarks,authority,type_of_shape], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{
        pool.query('SELECT id FROM tbl_marlens_area ORDER BY id DESC LIMIT 1',  (error, results) => {
            if (error) 
            {
              response.status(400).send({success:false,data: error})
              return;
            }
            response.status(200).send({success:true,data: results.rows[0].id})
        })
      }
      
  })
}

const readAton = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_aton_rep_aton WHERE is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
      res.push({total:results.rows[0].total})
      var sql=  'SELECT * FROM tbl_aton_rep_aton WHERE is_delete=false ORDER BY id ASC'
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
          items.push({rows:results.rows})
          res.push(items)
          //response.status(200).send({success:true,data:res})
          response.status(200).send({success:true,data:res})
        })
    })
    
}

const readAtonById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_aton_rep_aton WHERE id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const readAtonType = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_aton_rep_anton_type WHERE is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
      res.push({total:results.rows[0].total})
      var sql=  'SELECT * FROM tbl_aton_rep_anton_type WHERE is_delete=false ORDER BY id ASC'
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
          items.push({rows:results.rows})
          res.push(items)
          //response.status(200).send({success:true,data:res})
          response.status(200).send({success:true,data:res})
        })
    })
    
}

module.exports = {
    createAton,
    readAton,
    readAtonById,
    readAtonType
  }