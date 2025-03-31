import mongoose from 'mongoose';

// defino Schema:
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true }, // defino el campo nombre
    last_name: { type: String, required: true }, // defino el campo apellido
    email: { type: String, required: true, unique: true }, // defino el campo email como único
    password: { type: String },
    role: { type: String, default: 'user' } // defino el campo rol, por defecto será "user"
})

export const UserModel = mongoose.model('User', userSchema);
