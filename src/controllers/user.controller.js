import { UserModel } from '../models/User.model.js';
import { hashPassword } from '../utils/hash.js';  

// REGISTRO UN USUARIO
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body // obtengo los datos del body

        const existingUser = await UserModel.findOne({ email }) // verifico si ya existe ese email
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' }); // si existe, devuelvo error
        }

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password)
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' }) 
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body // obtengo email y password 

        const user = await UserModel.findOne({ email }) // busco el usuario por email

        if (!user) return res.status(401).send('User not found'); // si no existe devuelvo error 401

        const isMatch = await bcrypt.compare(password, user.password) // comparo contraseña ingresada con la guardada

        if (!isMatch) return res.status(401).send('Invalid credentials') // si no coincide, devuelvo error

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.first_name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
        });

        res.status(200).send('Login successful');
    } catch (error) {
        res.status(500).send('Login failed') // muestro error general
    }
}