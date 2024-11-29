/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function isAuthenticated() {
  // @ts-ignore
  return !!cookies().get('token')?.value
}

export async function auth() {
  // @ts-ignore
  const token = cookies().get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  redirect('/api/auth/sign-out')
}

export function getUserId() {
  // @ts-ignore
  const userId = cookies().get('userId')?.value

  return userId
}
