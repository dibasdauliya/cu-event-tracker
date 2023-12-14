import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import Layout from '~/components/layout'
import { authenticator } from '~/services/auth.server'
import { prisma } from '~/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  console.log({ user })

  if (user._json.email.split('@')[1] !== 'caldwell.edu') {
    console.log("redirecting to '/not-caldwell'")
    return redirect('/not-caldwell')
  }

  try {
    await prisma.user.upsert({
      where: { email: user._json.email },
      update: {
        name: user._json.name,
        picture: user._json.picture
      },
      create: {
        email: user._json.email,
        name: user._json.name,
        picture: user._json.picture
      }
    })
  } catch (error) {
    console.log({ error })
    return redirect('/')
  }

  return ''
}

export default function Events() {
  return (
    <Layout>
      <div>
        <h1>Post Event</h1>

        <Form method='post'>
          <div>
            <label htmlFor='event-title' className='font-semibold text-xl'>
              Title{' '}
            </label>
            <input
              id='event-title'
              // placeholder='separate by comma'
              name='event-title'
              className='w-full input-custom-style'
            />
          </div>
        </Form>
      </div>
    </Layout>
  )
}
