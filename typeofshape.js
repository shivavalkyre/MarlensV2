
const pool = require('./dbCon');


const createTypeofshape = (request, response) => {
    const {type_of_shape} = request.body
    pool.query('INSERT INTO tbl_marlens_typeofshape (type_of_shape) VALUES ($1)', [type_of_shape], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
            response.status(400).send({success:false,data:error})
        }
      }else{
        response.status(200).send({success:true,data:'Success entry new type of shape'})  
      }
      
  })
}

const readTypeofshape = (request, response) => {
    //const { id } = request.body

    pool.query(
        'SELECT * FROM tbl_marlens_typeofshape',
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const readTypeofshapeId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_marlens_typeofshape WHERE id=$1 and is_delete=false', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })
}

const updateTypeofshape = (request, response) => {
    const id = parseInt(request.params.id)
    const {type_of_shape} = request.body
    // select data first
    pool.query('SELECT * FROM tbl_marlens_typeofshape WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data:error})
      }
      if (results.rowCount >0){
        var update_time = new Date
        pool.query('UPDATE tbl_marlens_typeofshape set type_of_shape=$1,updated_at=$2 WHERE id=$3', [type_of_shape,update_time,id], (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          response.status(200).send({success:true,data:'Update type of shape success'})
      })
      }else{
          response.status(400).send({success:false,data:'Data not found'})
      }
      
  
  })
   
  }


  const deleteTypeofshape = (request, response) => {
    const id = parseInt(request.params.id)
    //const {levelid} = request.body
    pool.query('SELECT * FROM tbl_marlens_typeofshape WHERE id=$1', [id],(error, results) => {
      if (error) {
        response.status(400).send({success:false,data:error})
      }
      
      if (results.rowCount >0){
        var delete_time = new Date
        var level = results.rows[0].level
        var modul = results.rows[0].modul
        ///console.log(level)
        ///console.log(modul)
        pool.query('UPDATE tbl_marlens_typeofshape set is_delete = $1  WHERE id = $2', [true,id] ,(error1, results1) => {
          if (error1) {
            throw error1
          }
          response.status(200).send({success:true,data:'Delete type of shape success'})
      })

      }else{
        response.status(400).send({success:false,data:'Data not found'})
      }
    })
   
  }
module.exports = {
    createTypeofshape,
    readTypeofshape,
    readTypeofshapeId,
    updateTypeofshape,
    deleteTypeofshape,
  }