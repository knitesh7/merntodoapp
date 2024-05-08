const {connect} = require("mongoose")

const connectToDb = async(mongoURI)=>{
    await connect(mongoURI)
    console.log(`Connected to DB`)
}

module.exports = connectToDb


