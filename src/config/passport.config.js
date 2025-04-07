import passport from 'passport'; // importo passport principal
import local from 'passport-local'; // importo la estrategia local
import GitHubStrategy from 'passport-github2';  // importo la estrategia de GitHub
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';   // importo JWT
import { UserManager } from '../dao/mongo/UserManager.js';  // importo el modelo de usuario desde dao
import { hashPassword, isValidPassword } from '../utils/hash.js';

const userManager = new UserManager();

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
                const { first_name, last_name, age } = req.body // obtengo los datos del body
                const exists = await userManager.getByEmail(email) // busco si el usuario ya estite
                if (exists) {
                    return done(null, false, { message: 'User already exists' });
                }
                    const hashedPassword = hashPassword(password); // hasheo la contraseña
                const user = await userManager.createUser({
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    age,
                    role: email === 'adminCoder@coder.com' ? 'admin' : 'user' // asigno el rol según el correo
                })
                return done(null, user); // devuelvo el usuario
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
                const user = await userManager.getByEmail(email)
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                    const valid = isValidPassword(password, user.password);
                if (!valid) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                    return done(null, user) // si está bien, devuelvo el usuario
            } catch (error) {
                return done(error)
            }
        }
    ));

    // estrategia GitHub
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID, // lo toma del .env
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8084/api/users/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email || `${profile.username}@github.com` // fallback por si no tiene email público
            let user = await userManager.getByEmail(email);
            if (!user) {
                user = await userManager.createUser({
                    first_name: profile.username,
                    last_name: 'GitHubUser',
                    email,
                    password: '', // sin password porque se loguea por GitHub
                    role: profile.username === 'sastremax' ? 'admin' : 'user'
                });
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    // estrategia JWT para extraer usuario desde cookie
    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
            try {
                const user = await userManager.getById(jwtPayload.id);
                if (!user) return done(null, false, { message: 'User not found' });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

export default initializePassport