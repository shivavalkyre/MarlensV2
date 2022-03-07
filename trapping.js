// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'postgres',
//   host: '37.44.244.235',
//   database: 'masdex_dev',
//   password: 'dbapptgprK2021',
//   port: 5432
// })

const pool = require('./dbCon');

const createTrapping = (request, response) => {
    const {title,remarks,zonaid,authorityid,is_active,is_visible,type_of_shape,trapping_area,speed_limit,select_ship} = request.body
    pool.query('INSERT INTO tbl_marlens_trapping (title,remarks,zonaid,authorityid,is_active,is_visible,type_of_shape,trapping_area,speed_limit,select_ship) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [title,remarks,zonaid,authorityid,is_active,is_visible,type_of_shape,trapping_area,speed_limit,select_ship], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{
        pool.query('SELECT id FROM tbl_marlens_trapping ORDER BY id DESC LIMIT 1',  (error, results) => {
            if (error) 
            {
              response.status(400).send({success:false,data: error})
            }
            response.status(200).send({success:true,data: results.rows[0].id})
        })
      }
      
  })
}

const readTrapping = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_marlens_trapping WHERE is_delete=false and is_active=true or is_visible=true', (error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
      }
      res.push({total:results.rows[0].total})
      // ,row_number() OVER (ORDER BY tbl_marlens_trapping.id) AS row_number
      var sql=  'SELECT m.id,m.created_at,m.is_active,m.is_visible, k.ship_name, k.call_sign, k.mmsi, k.gt, j.ship_type FROM tbl_marlens_trapping m left join tbl_masdex_kapal k on m.select_ship = k.id left join tbl_masdex_jenis_kapal j on k.ship_type = j.id WHERE m.is_delete=false and (m.is_active=true or m.is_visible=true) ORDER BY m.id ASC'
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          items.push({rows:results.rows})
          res.push(items)
          response.status(200).send({success:true,data:res})
          //response.status(200).send(res)
        })
    })
    
}

const readTrappingById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_marlens_trapping WHERE id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const readTrappingIndex = (request, response) => {
 
  pool.query(
      'SELECT * FROM marlens_ship_trapping_index',
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data: error})
          return;
        }
          response.status(200).send({success:true,data:results.rows})
      })
}



const updateTrapping = (request, response) => {
    const id = parseInt(request.params.id)
    const {title,remarks,zonaid,authorityid,is_active,is_visible,type_of_shape,trapping_area,speed_limit,select_ship} = request.body
    // select data first
    pool.query('SELECT * FROM tbl_marlens_trapping WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      if (results.rowCount >0){
        var update_time = new Date
        pool.query('UPDATE tbl_marlens_trapping set title=$1,remarks=$2,zonaid=$3,authorityid=$4,is_active=$5,is_visible=$6,type_of_shape=$7,updated_at=$8,trapping_area=$10,speed_limit=$11,select_ship=$12 WHERE id=$9', [title,remarks,zonaid,authorityid,is_active,is_visible,type_of_shape,update_time,id,trapping_area,speed_limit,select_ship], (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }

          pool.query('DELETE FROM tbl_marlens_trapping_detail where trappingid=$1'
          , [id], (error, results) => {
              if (error) {

                  if (error.code == '23505') {
                      //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                      response.status(400).send('Duplicate data')
                      return;
                  }
              } else {
                  // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
              }

          })

          pool.query('SELECT id FROM tbl_marlens_trapping where id=$1 LIMIT 1', [id],  (error, results) => {
            if (error) 
            {
                throw error
            }
            response.status(200).send({success:true,data: results.rows[0].id})
          })
          // response.status(200).send({success:true,data:'Update trapping success'})
      })
      }else{
          response.status(400).send({success:false,data:'Data not found'})
      }
      
  
  })
   
  }


  const deleteTrapping = (request, response) => {
    const id = parseInt(request.params.id)
    //const {levelid} = request.body
    pool.query('SELECT * FROM tbl_marlens_trapping WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      
      if (results.rowCount >0){
        var delete_time = new Date
        //var level = results.rows[0].level
        //var modul = results.rows[0].modul
        ///console.log(level)
        ///console.log(modul)
        pool.query('UPDATE tbl_marlens_trapping set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,true,id] ,(error1, results1) => {
          if (error1) {
            response.status(400).send({success:false,data: error1})
            return;
          }
          
          pool.query('UPDATE tbl_marlens_trapping_detail set deleted_at = $1 ,is_delete = $2  WHERE trappingid = $3', [delete_time,true,id] ,(error1, results1) => {
            if (error1) {
              response.status(400).send({success:false,data: error1})
              return;
            }
    
          })
          
          response.status(200).send({success:true,data:'Delete trapping success'})
      })

      }else{
        response.status(400).send({success:false,data:'Data not found'})
      }
    })
   
  }


  const createShipTrapping = (request, response) => {
    const {trappingid,mmsi} = request.body
    pool.query('INSERT INTO tbl_marlens_ship_trapping (trappingid,mmsi) VALUES ($1,$2)', [trappingid,mmsi], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{
        pool.query('SELECT id FROM tbl_marlens_ship_trapping ORDER BY id DESC LIMIT 1',  (error, results) => {
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

const readShipTrapping = (request, response) => {
  //const { id } = request.body
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []
  pool.query('SELECT count(*) as total FROM marlens_ship_trapping_kapal', (error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    res.push({total:results.rows[0].total})
    var sql=  'SELECT *,row_number() OVER (ORDER BY marlens_ship_trapping_kapal.id) AS row_number FROM marlens_ship_trapping_kapal  ORDER BY id ASC'
    pool.query(
     sql,
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
        items.push({rows:results.rows})
        res.push(items)
        response.status(200).send({success:true,data:res})
        //response.status(200).send(res)
      })
  })
  
}

const readShipTrappingByTrappingId = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
      'SELECT * FROM marlens_ship_trapping_kapal WHERE trappingid=$1', [id],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}


const readShipTrappingById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
      'SELECT * FROM marlens_ship_trapping_kapal WHERE id=$1', [id],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}

const readShipTrappingByIdMMSI = (request, response) => {
  const {trappingid,mmsi} = request.body

  pool.query(
      'SELECT * FROM marlens_ship_trapping_kapal WHERE trappingid=$1 and mmsi=$2', [trappingid,mmsi],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}

const updateShipTrapping = (request, response) => {
  const id = parseInt(request.params.id)
  const {trappingid,mmsi} = request.body
  // select data first
  pool.query('SELECT * FROM tbl_marlens_ship_trapping WHERE id=$1', [id],(error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    if (results.rowCount >0){
      var update_time = new Date
      pool.query('UPDATE tbl_marlens_ship_trapping set trappingid=$1,mmsi=$2,updated_at=$3 WHERE id=$4', [trappingid,mmsi,update_time,id], (error, results) => {
        if (error) {
          response.status(400).send({success:false,data: error})
          return;
        }
        response.status(200).send({success:true,data:'Update trapping success'})
    })
    }else{
        response.status(400).send({success:false,data:'Data not found'})
    }
    

})
 
}

const deleteShipTrapping = (request, response) => {
  const id = parseInt(request.params.id)
  //const {levelid} = request.body
  pool.query('SELECT * FROM tbl_marlens_ship_trapping WHERE id=$1', [id],(error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    
    if (results.rowCount >0){
      var delete_time = new Date
      //var level = results.rows[0].level
      //var modul = results.rows[0].modul
      ///console.log(level)
      ///console.log(modul)
      pool.query('UPDATE tbl_marlens_ship_trapping set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,true,id] ,(error1, results1) => {
        if (error1) {
          response.status(400).send({success:false,data: error1})
          return;
        }
        response.status(200).send({success:true,data:'Delete trapping success'})
    })

    }else{
      response.status(400).send({success:false,data:'Data not found'})
    }
  })
 
}


  const createTrappingDetail = (request, response) => {
    const {trappingid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius} = request.body
    pool.query('INSERT INTO tbl_marlens_trapping_detail (trappingid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [trappingid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }
      pool.query('SELECT id FROM tbl_marlens_trapping_detail ORDER BY id DESC LIMIT 1',  (error, results) => {
        if (error) 
        {
          response.status(400).send({success:false,data: error})
          return;
        }
        response.status(200).send({success:true,data: results.rows[0].id})
    })

  })
}

const readTrappingDetail = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_marlens_trapping_detail WHERE is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      res.push({total:results.rows[0].total})
      var sql=  'SELECT * FROM tbl_marlens_trapping_detail WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          items.push({rows:results.rows})
          res.push(items)
          response.status(200).send({success:true,data:res})
          //response.status(200).send(res)
        })
    })
    
}

const readTrappingDetailById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_marlens_trapping_detail WHERE id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const readTrappingDetailByTrappingId = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
      'SELECT * FROM tbl_marlens_trapping_detail WHERE trappingid=$1 and is_delete=false', [id],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}

const updateTrappingDetail = (request, response) => {
    const id = parseInt(request.params.id)
    const {degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius} = request.body
    // select data first
    pool.query('SELECT * FROM tbl_marlens_trapping_detail WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      if (results.rowCount >0){
        var update_time = new Date
        pool.query('UPDATE tbl_marlens_trapping_detail set degree1=$1,minute1=$2,second1=$3,direction1=$4,degree2=$5,minute2=$6,second2=$7,direction2=$8,radius=$9,updated_at=$10 WHERE id=$11', [degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius,update_time,id], (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
          response.status(200).send({success:true,data:'Update trapping success'})
      })
      }else{
          response.status(400).send({success:false,data:'Data not found'})
      }
      
  
  })
   
  }

const deleteTrappingDetail = (request, response) => {
    const id = parseInt(request.params.id)
    //const {levelid} = request.body
    pool.query('SELECT * FROM tbl_marlens_trapping_detail WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      
      if (results.rowCount >0){
        var delete_time = new Date
        //var level = results.rows[0].level
        //var modul = results.rows[0].modul
        ///console.log(level)
        ///console.log(modul)
        pool.query('UPDATE tbl_marlens_trapping_detail set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,true,id] ,(error1, results1) => {
          if (error1) {
            response.status(400).send({success:false,data: error1})
            return;
          }
          response.status(200).send({success:true,data:'Delete trapping success'})
      })

      }else{
        response.status(400).send({success:false,data:'Data not found'})
      }
    })
   
  }

module.exports = {
    createTrapping,
    readTrapping,
    readTrappingIndex,
    readTrappingById,
    updateTrapping,
    deleteTrapping,
    createTrappingDetail,
    readTrappingDetail,
    readTrappingDetailById,
    readTrappingDetailByTrappingId,
    updateTrappingDetail,
    deleteTrappingDetail,
    createShipTrapping,
    readShipTrapping,
    readShipTrappingById,
    readShipTrappingByIdMMSI,
    readShipTrappingByTrappingId,
    updateShipTrapping,
    deleteShipTrapping,
  }