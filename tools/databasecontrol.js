const mongodb = require('mongodb')
const  MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId
const mongodbUrl = 'mongodb://127.0.0.1:27017'
class MongoControl{
    constructor(dbName,collectionName){
        this.dbName = dbName
        this.collectionName = collectionName
    }
    find(findQuery,callback){
        MongoClient.connect(mongodbUrl,{useNewUrlParser : true},(error,client)=>{
            if (error) {
                callback(error)
                return
            }
            var db = client.db(this.dbName)
            db.collection(this.collectionName).find(findQuery).toArray(function(error,result){
                callback(error,result)
                client.close()
            })
        })
    }
    findById(_id,callback){
        this.find({_id : ObjectId(_id)},callback)
    }
    insert(docs,callback){
        MongoClient.connect(mongodbUrl,{useNewUrlParser : true},(error,client)=>{
            if(error){
             callback(error)    
             return
            }
            var db = client.db(this.dbName)
            db.collection(this.collectionName).insert(docs,(error,result)=>{
                callback(error,result)
                client.close()
            })
        })
    }
    update(findQuery,newData,callback){
        MongoClient.connect(mongodbUrl,{useNewUrlParser : true},(error,client)=>{
            if(error){
                callback(error)
                return
            }
            var db = client.db(this.dbName)
            db.collection(this.collectionName).updateMany(findQuery,{$set:newData},(error,result)=>{
                callback(error,result)
                client.close()
            })
            
        })
    }
    updateById(_id , newDocs , callback){
        this.update({_id : ObjectId(_id) } , newDocs , callback)
    }
    remove(findQuery,callback){
        MongoClient.connect(mongodbUrl,{useNewUrlParser : true},(error,client)=>{
            if(error){
                callback(error)
                return
            }
            var db = client.db(this.dbName)
            db.collection(this.collectionName).remove(findQuery,(error,result)=>{
                callback(error,result.result)
                client.close()
            })
            
        })
    }
    removeById(_id,callback){
        this.remove({_id: ObjectId(_id)} ,callback)
    }
}



exports.MongoControl = MongoControl