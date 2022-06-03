
 
 
  
const handleDuplicateKeyError = (err, res) => {
    // console.log("ersdsdsr"); 
    // console.log(err); 
    try { 
        const fieldNameList = Object.keys(err.keyValue);
        // const error = `An account with that ${field} already exists.`;
    
        const error = `An account with given values ${fieldNameList.join(",")}  already exists.`;
        res.status(err.statusCode || 409 ).json({
            message : error
        })
    }
    catch (err ){
        console.log(err)
        res.status(500).json({ message : "Something went wrong at 'handleDuplicateKeyError' "  })
    }
 
}
 const handleValidationError = (err, res) => {
    let error = Object.values(err.errors).map(el => el.path);
    if(error.length > 1) {
        error = error.join(',')
    }
    error = "Enter valid values for " + error;
    res.status(err.statusCode || 400).json({
        message : error
    })
}

const handle_mongoose_validation_error = (err, res) => {
       console.log( "START of handle_mongoose_validation_error")
    let errorList = []; 
    let error = Object.values(err.errors).map((el )=> {
        errorList.push( { fieldName:el.path , message:el.message })
        return el.path;
    });
    if(error.length > 1) {
        error = error.join(',')
    }
    error = "Enter valid values for " + error;
    res.status(err.statusCode || 400).json({
        message : error ||  "Validation Error", 
        errorList , 
    })
    console.log( "End of handle_mongoose_validation_error")
}



 
 module.exports  = (func) => {
    //  console.log( "inside catch error func")
    return (req, res, next) => {

        // console.log( req) ; 
          console.log( "Calling with req, res, next")
        // func(req, res, next).catch(next);
        func(req, res, next).catch((err)=>{
            // console.log( "err  --> "); 
            // console.log( err) ; 
       
            
            console.log( "err.name  --> "); 
            console.log( err.name) ; 
            
            console.log( "err.code  --> "); 
            console.log( err.code) ; 

                  console.log( "err.statusCode  --> "); 
            console.log( err.statusCode) ; 

            if(err.name === 'ValidationError'    ) { return   handle_mongoose_validation_error(err, res);}
            if(err.name === 'MongoServerError') return err = handleDuplicateKeyError(err, res);
            else if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
            else res.status(err.statusCode||500).json({
                message : err.message
            })


            // res.send( {error: error})
            // next()
        });
    };
};