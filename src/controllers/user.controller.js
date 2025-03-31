import { UserModel } from '../models/User.model.js';
import bcrypt from 'bcrypt';

// REGISTRO UN USUARIO
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body // obtengo los datos del body

        const userExists = await UserModel.findOne({ email }) // verifico si ya existe ese email
        if (userExists) return res.status(400).send('User already exists') // si existe, devuelvo error

        const hashedPassword = await bcrypt.hash(password, 10) // hasheo la contraseña

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword, // guardo la contraseña hasheada
            role: email === 'adminCoder@coder.com' ? 'admin' : 'user' // asigno rol según el correo
        })

        res.status(201).send(`User ${newUser.email} created`) // confirmo que se creó el usuario
    } catch (error) {
        res.status(500).send('Server error') // devuelvo error general si algo falla
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.query // obtengo email y password 

        const user = await UserModel.findOne({ email }) // busco el usuario por email

        if (!user) return res.status(401).send('User not found') // si no existe devuelvo error 401

        const isMatch = await bcrypt.compare(password, user.password) // comparo contraseña ingresada con la guardada

        if (!isMatch) return res.status(401).send('Invalid credentials') // si no coincide, devuelvo error

        res.redirect(`/api/users/products?name=${user.first_name}&role=${user.role}`) // redirijo a la vista de productos con datos por query
    } catch (error) {
        res.status(500).send('Login failed') // muestro error general
    }
}