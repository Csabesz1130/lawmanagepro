interface SessionStatus {
  isActive: boolean
}

export class AuthenticationClient {
  static async verifySession(): Promise<SessionStatus> {
    try {
      const response = await fetch('/api/auth/verify-session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return { isActive: false }
      }

      const data = await response.json()
      return { isActive: data.isActive }
    } catch (error) {
      console.error('Session verification failed:', error)
      return { isActive: false }
    }
  }
}
