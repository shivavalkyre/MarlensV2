const pool = require('./dbCon');

const createShipType = (request, response) => {
    const {ship_type} = request.body
    pool.query('INSERT INTO tbl_masdex_jenis_kapal (ship_type) VALUES ($1)', [ship_type], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({error:'Duplicate data'})
            return;
        }else{
            response.status(400).send({error:error})
        }
      }else{

            response.status(200).send({success:true,data: 'data success inserted'})
        
      }
      
  })
}

const readShipType = (request, response) => {
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_masdex_jenis_kapal', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})

     var sql= 'SELECT * FROM tbl_masdex_jenis_kapal ORDER BY id ASC '
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


  
const readShipTypeChild = (request, response) => {
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM marlens_ship_type_child', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM marlens_ship_type_child ORDER BY id ASC '
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


  const updateShipType = (request, response) => {
    const id = parseInt(request.params.id)
    const {ship_type} = request.body
    pool.query('UPDATE tbl_masdex_jenis_kapal SET ship_type=$1 WHERE id=$2', [ship_type,id], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({error:'Duplicate data'})
            return;
        }else{
            response.status(400).send({error:error})
        }
      }else{

            response.status(200).send({success:true,data: 'data success inserted'})
        
      }
      
  })
}

const deleteShipType = (request, response) => {
    const id = parseInt(request.params.id)
    //const {levelid} = request.body
    pool.query('SELECT * FROM tbl_masdex_jenis_kapal WHERE id=$1', [id],(error, results) => {
      if (error) {
        throw error
      }
      
      if (results.rowCount >0){
        var delete_time = new Date
        //var level = results.rows[0].level
        //var modul = results.rows[0].modul
        ///console.log(level)
        ///console.log(modul)
        pool.query('UPDATE tbl_masdex_jenis_kapal set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,false,id] ,(error1, results1) => {
          if (error1) {
            throw error1
          }
          response.status(200).send({success:true,data:'Delete ship type success'})
      })

      }else{
        response.status(400).send({success:false,data:'Data not found'})
      }
    })
   
  }

  module.exports = {
    createShipType,
    readShipType,
    readShipTypeChild,
    updateShipType,
    deleteShipType,
  }