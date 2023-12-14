import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { SocialsProvider } from 'remix-auth-socials'
import Layout from '~/components/layout'
import { authenticator } from '~/services/auth.server'

export const meta: MetaFunction = () => {
  return [{ title: '' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  if (user?._json?.email) {
    return json({ isLoggedIn: true })
  }

  return json({ isLoggedIn: false })
}

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>()

  console.log({ isLoggedIn })

  return (
    <Layout isLoggedIn={isLoggedIn}>
      {isLoggedIn ? (
        <Link
          to='/event'
          className='bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-md font-semibold text-center block mx-auto hover:brightness-110'>
          Go to Event
        </Link>
      ) : (
        <Form action={`/auth/${SocialsProvider.GOOGLE}`} method='post'>
          <button className='bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-md font-semibold text-center block mx-auto hover:brightness-110'>
            Login With Google
          </button>
        </Form>
      )}
    </Layout>
  )
}
