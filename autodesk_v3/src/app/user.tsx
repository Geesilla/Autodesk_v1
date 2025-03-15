'use client'

import { useUser } from "@clerk/nextjs"

export default function User() {
    const { isSignedIn, user, isLoaded } = useUser()
  
    if (!isLoaded) {
      return <div>Loading...</div>
    }
  
    if (!isSignedIn) {
      return <div>Sign in to view this page</div>
    }
  
    return <div>Hello {user.username }!</div>
  }