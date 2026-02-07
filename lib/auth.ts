import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData, defaultSession, sessionOptions } from './session'

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}

export async function requireAuth() {
  const session = await getSession()

  if (!session.isLoggedIn) {
    return null
  }

  return {
    userId: session.userId!,
    email: session.email!,
    name: session.name!,
    role: session.role!,
  }
}
