import { Form } from '@remix-run/react'

export default function Layout({ children, isLoggedIn = true }) {
  return (
    <div className='bg-bg-img w-screen h-screen bg-cover grid place-items-center'>
      {isLoggedIn && (
        <Form action='/log-out' method='post' className='fixed top-4 right-4'>
          <button className='bg-red-500 hover:bg-red-600 p-2 rounded-md font-semibold'>
            Logout
          </button>
        </Form>
      )}

      <div className='max-w-3xl p-4 bg-white/40 backdrop-blur-md w-96 '>
        <h1 className='text-2xl font-bold text-center mb-8'>
          <span className='text-red-500'>CU</span> Event Tracker
        </h1>

        {children}
      </div>
    </div>
  )
}
