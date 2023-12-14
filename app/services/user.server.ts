import { prisma } from '~/utils/db.server'
import { authenticator } from './auth.server'

export async function getActiveUserDetails(request: any) {
  const user = await authenticator.isAuthenticated(request)
  //   console.log(typeof user)
  //   console.log({ user })
  const userDetails = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      email: user?._json?.email || ''
    },
    select: {
      picture: true,
      name: true,
      id: true
    }
  })
  return userDetails
}
