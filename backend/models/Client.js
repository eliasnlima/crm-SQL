
import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
    codigo: String,
    nome: { type: String, required: true},
    CNPJ: { type: String, unique: true, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fone: String,
    email: String,
    status: {
        type: String,
        enum: ["Prospecção", "Em negociação", "Cliente novo", "Acompanhamento", "Inativo", "Reativado", "Tirar da carteira", "Vazio"],
        default: 'Vazio'
    },
    proxInt: {
        type: Date,
        default: null
    },
    grupoEconomico: {
        type: String,
        default: null
    },
    nomeGrupo: {
        type: String,
        default: null
    }
})

export default model("Client", ClientSchema)