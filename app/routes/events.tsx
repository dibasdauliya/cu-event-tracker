import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import Layout from '~/components/layout'
import { authenticator } from '~/services/auth.server'
import { getActiveUserDetails } from '~/services/user.server'
import { prisma } from '~/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  console.log({ user })

  if (user?._json?.email?.split('@')[1] !== 'caldwell.edu') {
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

    const events = await prisma.event.findMany({})
    const comments = await prisma.eventComments.findMany({})

    return json({ events, comments })
  } catch (error) {
    console.log({ error })
    return redirect('/')
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const values = Object.fromEntries(formData)
  const { eventComment, eventId } = values

  const userDetails = await getActiveUserDetails(request)

  if (!userDetails?.id) {
    return redirect('/not-caldwell')
  }

  try {
    await prisma.eventComments.create({
      data: {
        text: String(eventComment),
        eventId: String(eventId),
        userId: String(userDetails.id)
      }
    })

    return ''
  } catch (error) {
    console.log(error)
    return redirect('/')
  }
}

export default function Events() {
  const { events, comments } = useLoaderData<typeof loader>()

  return (
    <>
      <Layout>
        <h1 className='text-2xl font-bold mb-8'>Events</h1>

        <main className='flex flex-col h-[500px] overflow-y-auto space-y-5'>
          {events.map((event) => (
            <>
              <div
                key={event.id}
                className='flex flex-col border border-gray-500 p-4 rounded-md'>
                <h2 className='font-bold text-lg'>{event.title}</h2>
                <p className='text-sm'>{event.description}</p>
                <p className='text-sm'>Date & Time: {event.date}</p>
                <img src={event.image || ''} alt='' />
                <p className='text-sm'>Location: {event.location}</p>
                <p className='text-sm'>Organizer: {event.organizer}</p>
                <p className='text-sm'>Attraction: {event.attraction}</p>
              </div>

              {/* comment */}

              {/* <div className='ml-5'>
              Comments
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className='flex flex-col border border-gray-500 p-4 rounded-md'>
                  <p className='text-sm'>{comment.text}</p>
                </div>
              ))}
            </div> */}

              {/* <Form className='ml-5'>
              <div>
                <label
                  htmlFor='event-comment'
                  className='font-semibold text-xl'>
                  Add Comment{' '}
                </label>
                <input type='hidden' name='eventId' value={event.id} />
                <textarea
                  id='event-comment'
                  name='eventComment'
                  className='w-full px-2 rounded-sm outline-none focus:border-brand border'
                />
              </div>
              <button className='bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-md font-semibold mx-auto hover:brightness-110'>
                Add Comment
              </button>
            </Form> */}
            </>
          ))}
        </main>
      </Layout>
      <Link
        to='/post-event'
        className=' fixed top-16 right-4 bg-green-500 hover:bg-green-600 p-2 rounded-md font-semibold'>
        Post Event
      </Link>
    </>
  )
}
