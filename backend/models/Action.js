import { Schema, model } from "mongoose";

const ActionSchema = new Schema({
    descricao: String,
    date: { type: Date, default: Date.now},
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    user: {
        
        type: Schema.Types.ObjectId,
        ref: 'User'
        
        
    }
})

export default model("Action", ActionSchema)