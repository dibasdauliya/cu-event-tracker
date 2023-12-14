import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '../services/auth.server.js'
import { SocialsProvider } from 'remix-auth-socials'

export const action: ActionFunctionArgs = ({ request }) => login(request)
export const loader: LoaderFunctionArgs = ({ request }) => login(request)

async function login(request: Request) {
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: '/events',
    failureRedirect: '/'
  })
}
