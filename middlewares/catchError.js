  
const handleDuplicateKeyError = (err, res) => {
  try { 
    const fieldNameList =  err && err.keyValue && Object.keys(err.keyValue) || [];
    // const error = `An account with that ${field} already exists.`;
    
    const error = `An account with given values ${fieldNameList.join(",")}  already exists.`;
    res.status(err.statusCode || 409 ).json({
      message : error
    });
  }
  catch (err ){
    res.status(500).json({ message : "Something went wrong at 'handleDuplicateKeyError' "  });
  }
 
};
 
const handle_mongoose_validation_error = (err, res) => {
  try{ 
        
    let errorList = []; 
    let error = Object.values(err.errors).map((el )=> {
      errorList.push( { fieldName:el.path , message:el.message });
      return el.path;
    });
    if(error.length > 1) {
      error = error.join(',');
    }
    error = "Enter valid values for " + error;
    res.status(err.statusCode || 400).json({
      message : error ||  "Validation Error", 
      errorList , 
    });
  }
  catch ( err) { 
    console.error( err) ; 
    // res.status(500).json({
    //     message :err,  
    // })
  }
    
};
 
module.exports  = (func) => {
  return (req, res, next) => {

    // func(req, res, next).catch(next);
    func(req, res, next).catch((err)=>{

      try{ 
        if(err.name === 'ValidationError'    ) { return   handle_mongoose_validation_error(err, res);}
        if(err.name === 'MongoServerError') return err = handleDuplicateKeyError(err, res);
        else if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
        else res.status(err.statusCode||500).json({
          message : err.message
        });
      }
      catch ( err) { 
        console.error( err);
       
      }
    
    });
  };
};