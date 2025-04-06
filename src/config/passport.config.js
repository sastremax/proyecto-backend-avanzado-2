import passport from 'passport'; // importo passport principal
import local from 'passport-local'; // importo la estrategia local
import GitHubStrategy from 'passport-github2';  // importo la estrategia de GitHub
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';   // importo JWT
import { UserModel } from '../models/User.model.js';  // importo el modelo de usuario
import { compareSync, hashSync } from 'bcrypt';  // importo funciones de bcrypt

const LocalStrategy = local.Strategy;  // creo una constante para usar la estrategia local

const cookieExtractor = (req) => {
    return req?.cookies?.jwtToken;
};

// inicializo todas las estrategias
const initializePassport = () => {
    // estretegia para registrar usuarios
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name } = req.body // obtengo los datos del body
                const exists = await UserModel.findOne({ email }) // busco si el usuario ya estite
                if (exists) return done(null, false) // si existe, corto el registro
                const hashedPassword = hashSync(password, 10) // hasheo la contraseña
                const user = await UserModel.create({
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    role: email === 'adminCoder@coder.com' ? 'admin' : 'user' // asigno el rol según el correo
                })
                return done(null, user) // devuelvo el usuario
            } catch (error) {
                return done(error)
        }
        }
    ));

    // estrategia para login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email })
                if (!user) return done(null, false) // si no existe, corto
                const valid = compareSync(password, user.password)
                if (!valid) return done(null, false) // si la contraseña no coincide, corto
                return done(null, user) // si está bien, devuelvo el usuario
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID, // lo toma del .env
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8084/api/users/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email || `${profile.username}@github.com` // fallback por si no tiene email público
            let user = await UserModel.findOne({ email })
            if (!user) {
                user = await UserModel.create({
                    first_name: profile.username,
                    last_name: 'GitHubUser',
                    email,
                    password: '', // sin password porque se loguea por GitHub
                    role: 'user'
                })
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
            try {
                const user = await UserModel.findById(jwtPayload.id);
                if (!user) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // serializo el usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    // deserializo para recuperar los datos del usuario en cada request
    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    });    
};

export default initializePassport