import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { getActiveUserDetails } from '~/services/user.server'
import { prisma } from '~/utils/db.server'

// action

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const values = Object.fromEntries(formData)

  const userDetails = await getActiveUserDetails(request)

  if (!userDetails?.id) {
    return redirect('/not-caldwell')
  }

  const {
    eventTitle,
    eventDescription,
    eventDate,
    eventTime,
    eventImage,
    eventLocation,
    eventOrganizer,
    eventAttraction
  } = values

  console.log({
    first: eventTitle,
    second: eventDescription,
    third: eventDate,
    fourth: eventTime,
    fifth: eventImage,
    sixth: eventLocation,
    seventh: eventOrganizer,
    eighth: eventAttraction
  })

  try {
    await prisma.event.create({
      data: {
        title: String(eventTitle),
        description: String(eventDescription),
        date: String(eventDate) + ',' + String(eventTime),
        image: String(eventImage),
        location: String(eventLocation),
        organizer: String(eventOrganizer),
        attraction: String(eventAttraction),
        userId: String(userDetails.id)
      }
    })

    console.log('success')

    return redirect('/events')
  } catch (error) {
    console.log({ error })
    return ''
    // return new Response('Internal Server Error', { status: 500 })
  }
}

export default function PostEvent() {
  return (
    <div className='max-w-2xl m-4 p-4'>
      <h1 className='font-bold text-2xl'>Post Event</h1>

      <Form method='post' className='mt-4'>
        <div>
          <label htmlFor='event-title' className='font-semibold text-xl'>
            Title{' '}
          </label>
          <input
            id='event-title'
            // placeholder='separate by comma'
            name='eventTitle'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-description' className='font-semibold text-xl'>
            Description{' '}
          </label>
          <textarea
            id='event-description'
            name='eventDescription'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-date' className='font-semibold text-xl'>
            Date{' '}
          </label>
          <input
            id='event-date'
            type='date'
            name='eventDate'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        {/* for time */}
        <div className='mt-4'>
          <label htmlFor='event-time' className='font-semibold text-xl'>
            Time{' '}
          </label>
          <input
            id='event-time'
            type='time'
            name='eventTime'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-image' className='font-semibold text-xl'>
            Image{' '}
          </label>
          <input
            id='event-image'
            type='text'
            name='eventImage'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-location' className='font-semibold text-xl'>
            Location{' '}
          </label>
          <input
            id='event-location'
            type='text'
            name='eventLocation'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-organizer' className='font-semibold text-xl'>
            Organizer{' '}
          </label>
          <input
            id='event-organizer'
            type='text'
            name='eventOrganizer'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='event-attraction' className='font-semibold text-xl'>
            Attraction{' '}
          </label>
          <input
            id='event-attraction'
            type='text'
            name='eventAttraction'
            className='w-full px-2 py-3 rounded-sm outline-none focus:border-brand border'
          />
        </div>

        <button
          type='submit'
          className='bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-md font-semibold block hover:brightness-110 mt-4'>
          Post Event
        </button>
      </Form>

      <Link
        to='/'
        className=' fixed top-4 right-4 bg-green-500 hover:bg-green-600 p-2 rounded-md font-semibold'>
        Go back to Home
      </Link>
    </div>
  )
}
