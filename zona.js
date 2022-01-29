
const pool = require('./dbCon');


const createZona = (request, response) => {
    const {zona,remarks,zona_type_id,authority,type_of_shape} = request.body
    pool.query('INSERT INTO tbl_marlens_zona (zona,remarks,type_of_zone,authority,type_of_shape) VALUES ($1,$2,$3,$4,$5)', [zona,remarks,zona_type_id,authority,type_of_shape], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{
        pool.query('SELECT id FROM tbl_marlens_zona ORDER BY id DESC LIMIT 1',  (error, results) => {
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

const readZona = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_marlens_zona WHERE is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      res.push({total:results.rows[0].total})
      var sql=  'SELECT * FROM tbl_marlens_zona WHERE is_delete=false ORDER BY id ASC'
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

const readZonaExeptThis = (request, response) => {
  const  id  = parseInt(request.params.id);
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []
  pool.query('SELECT count(*) as total FROM tbl_marlens_zona WHERE is_delete=false and id!=$1',[id], (error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    res.push({total:results.rows[0].total})
    var sql=  'SELECT * FROM tbl_marlens_zona WHERE is_delete=false and id!=$1 ORDER BY id ASC'
    pool.query(
     sql,[id],
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

const readZonaById = (request, response) => {
    const levelid = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_marlens_zona WHERE id=$1', [levelid],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
            return;
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const updateZona = (request, response) => {
    const id = parseInt(request.params.id)
    const {zona,remarks,zona_type_id,authority,type_of_shape} = request.body
    // select data first
    pool.query('SELECT * FROM tbl_marlens_zona WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      if (results.rowCount >0){
        var update_time = new Date
        pool.query('UPDATE tbl_marlens_zona set zona=$1,remarks=$2,type_of_zone=$3,authority=$4,type_of_shape=$5,updated_at=$6 WHERE id=$7', [zona,remarks,zona_type_id,authority,type_of_shape,update_time,id], (error, results) => {
          if (error) {
            response.status(400).send({success:false,data: error})
            return;
          }
          response.status(200).send({success:true,data:'Update zona success'})
      })
      }else{
          response.status(400).send({success:false,data:'Data not found'})
      }
      
  
  })
   
  }


  const deleteZona = (request, response) => {
    const id = parseInt(request.params.id)
    //const {levelid} = request.body
    pool.query('SELECT * FROM tbl_marlens_zona WHERE id=$1', [id],(error, results) => {
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
        pool.query('UPDATE tbl_marlens_zona set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,true,id] ,(error1, results1) => {
          if (error1) {
            response.status(400).send({success:false,data: error1})
            return;
          }
          response.status(200).send({success:true,data:'Delete zona success'})
      })

      }else{
        response.status(400).send({success:false,data:'Data not found'})
      }
    })
   
  }



  const createZonaDetail = (request, response) => {
    const {zonaid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius} = request.body
    pool.query('INSERT INTO tbl_marlens_zona_detail (zonaid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [zonaid,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,radius], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
          response.status(400).send({success:false,data: error})
          return;
        }
      }else{

            response.status(200).send({success:true,data: 'Entry new data success'})
        
      }
      
  })
}

const readZonaDetail = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_marlens_zona_detail WHERE is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false,data: error})
        return;
      }
      res.push({total:results.rows[0].total})
      var sql=  'SELECT * FROM tbl_marlens_zona_detail WHERE is_delete=false ORDER BY id ASC'
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




const readZonaDetailById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_marlens_zona_detail WHERE id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const readZonaDetailByZonaId = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
      'SELECT * FROM tbl_marlens_zona_detail WHERE zonaid=$1 and is_delete=false order by id ASC', [id],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}


const updateZonaDetail = (request, response) => {
    const id = request.params.id
    var update_time = new Date()
    const {zonaid,radius,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2} = request.body
    pool.query('UPDATE tbl_marlens_zona_detail SET zonaid=$1,radius=$2,degree1=$3,minute1=$4,second1=$5,direction1=$6,degree2=$7,minute2=$8,second2=$9,direction2=$10,updated_at=$11 WHERE id=$12', [zonaid,radius,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,update_time,id], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
          response.status(400).send({success:false,data: error})
          return;
        }
      }else{

            response.status(200).send({success:true,data: 'Entry new data success'})
        
      }
      
  })
}

const deleteZonaDetail = (request, response) => {
    const id = request.params.id
    var delete_time = new Date()
    //const {zonaid,zona_type_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2} = request.body
    pool.query('UPDATE tbl_marlens_zona_detail SET deleted_at=$1,is_delete=$2 WHERE id=$3', [delete_time,true,id], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{

            response.status(200).send({success:true,data: 'delete zone success'})
        
      }
      
  })
}

const createZonaType = (request, response) => {
  const {zona_type} = request.body
  pool.query('INSERT INTO tbl_marlens_zona_type (zona_type) VALUES ($1)', [zona_type], (error, results) => {
    if (error) {
      if (error.code == '23505')
      {
          response.status(400).send({success:false,data:'Duplicate data'})
          return;
      }else{
        response.status(400).send({success:false,data: error})
        return;
      }
    }else{
      
          response.status(200).send({success:true,data: 'Zona Type inserted'})

    }
    
})
}

const readZonaType = (request, response) => {
  //const { id } = request.body
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []
  pool.query('SELECT count(*) as total FROM tbl_marlens_zona_type WHERE is_delete=false', (error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    res.push({total:results.rows[0].total})
    var sql=  'SELECT * FROM tbl_marlens_zona_type WHERE is_delete=false ORDER BY id ASC'
    pool.query(
     sql,
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data: error})
          return;
        }
        items.push({rows:results.rows})
        res.push(items)
        response.status(200).send({success:true,data:res})
        //response.status(200).send(res)
      })
  })
  
}

const readZonaTypeById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
      'SELECT * FROM tbl_marlens_zona_type WHERE id=$1', [id],
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
          response.status(200).send({success:true,data:results.rows})
      })
}


const updateZonaType = (request, response) => {
  const id = parseInt(request.params.id)
  const {zona_type} = request.body
  // select data first
  pool.query('SELECT * FROM tbl_marlens_zona_type WHERE id=$1', [id],(error, results) => {
    if (error) {
      response.status(400).send({success:false,data: error})
      return;
    }
    if (results.rowCount >0){
      var update_time = new Date
      pool.query('UPDATE tbl_marlens_zona_type set zona_type=$1,updated_at=$2 WHERE id=$3', [zona_type,update_time,id], (error, results) => {
        if (error) {
          response.status(400).send({success:false,data: error})
          return;
        }
        response.status(200).send({success:true,data:'Update zona type success'})
    })
    }else{
        response.status(400).send({success:false,data:'Data not found'})
    }
    

})
 
}

const deleteZonaType = (request, response) => {
  const id = parseInt(request.params.id)
  //const {levelid} = request.body
  pool.query('SELECT * FROM tbl_marlens_zona_type WHERE id=$1', [id],(error, results) => {
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
      pool.query('UPDATE tbl_marlens_zona_type set deleted_at = $1 ,is_delete = $2  WHERE id = $3', [delete_time,true,id] ,(error1, results1) => {
        if (error1) {
          response.status(400).send({success:false,data: error1})
          return;
        }
        response.status(200).send({success:true,data:'Delete zona success'})
    })

    }else{
      response.status(400).send({success:false,data:'Data not found'})
    }
  })
 
}

module.exports = {
    createZona,
    readZona,
    readZonaExeptThis,
    readZonaById,
    updateZona,
    deleteZona,
    createZonaDetail,
    readZonaDetail,
    readZonaDetailById,
    readZonaDetailByZonaId,
    updateZonaDetail,
    deleteZonaDetail,
    createZonaType,
    readZonaType,
    readZonaTypeById,
    updateZonaType,
    deleteZonaType
  }