declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      profile?: {
        id: string
        type: string
        rating: number
        companyName?: string | null
        location?: string | null
      } | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    profile?: {
      id: string
      type: string
      rating: number
      companyName?: string | null
      location?: string | null
    } | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    profile?: {
      id: string
      type: string
      rating: number
      companyName?: string | null
      location?: string | null
    } | null
  }
}
