import { Express } from 'express'
import Jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy as CustomStrategy } from 'passport-custom'
import { Configuration } from '~/core/configuration'
import { COOKIE_MAX_AGE, Cookies } from './cookies'
import { GoogleProvider } from './providers/google.provider'

const verifySession = async (req: any, done: any) => {
  try {
    const token = Cookies.get(req, 'MARBLISM_ACCESS_TOKEN')
    if (!token) {
      return done(null, false)
    }

    const secret = Configuration.getAuthenticationSecret()
    const decoded = Jwt.verify(token, secret)
    return done(null, decoded)
  } catch (error) {
    return done(error, false)
  }
}

const providers = [GoogleProvider]

export const getProviders = () => {
  return providers.filter(provider => provider.isActive())
}

export const expressSetup = (app: Express) => {
  app.use(passport.initialize())

  getProviders().forEach(provider => passport.use(provider.strategy))
  passport.use('verify-session', new CustomStrategy(verifySession))

  app.get('/api/auth/verify-session', 
    passport.authenticate('verify-session', {session: false}),
    (req, res) => res.json({isActive: true})
  )

  app.get('/api/auth/:provider', (req, res, next) => {
    const provider = req.params.provider
    passport.authenticate(provider, {
      scope: ['profile', 'email'], // You can customize scope per provider if needed
      session: false,
      prompt: 'select_account',
    })(req, res, next) // Invoke the Passport authenticate function
  })

  app.get(
    '/api/auth/:provider/callback',
    (req, res, next) => {
      const provider = req.params.provider
      passport.authenticate(provider, { failureRedirect: '/', session: false })(
        req,
        res,
        next,
      )
    },
    (req, res) => {
      // Successful authentication, redirect to your desired route
      const provider = req.params.provider

      const secret = Configuration.getAuthenticationSecret()

      const jwtToken = Jwt.sign(
        {
          userId: req.user['user'].id,
          [`${provider}AccessToken`]: req.user['accessToken'],
          [`${provider}RefreshToken`]: req.user['refreshToken'],
        },
        secret,
        {
          expiresIn: COOKIE_MAX_AGE,
        },
      )

      Cookies.setOnResponse(res, 'MARBLISM_ACCESS_TOKEN', jwtToken)

      res.redirect('/')
    },
  )
}
