import { Authenticator } from 'remix-auth'
import { GoogleStrategy, SocialsProvider } from 'remix-auth-socials'
import { sessionStorage } from '~/services/session.server'

export const authenticator = new Authenticator(sessionStorage)

// Configuring Google Strategy
authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ['openid email profile'],
      callbackURL: `http://localhost:3000/auth/${SocialsProvider.GOOGLE}/callback`
    },
    async ({ profile }) => {
      return profile
    }
  )
)
