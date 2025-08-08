import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createClient = () => {
  return createClientComponentClient<Database>()
}

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const getUser = async () => {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async () => {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return profile
}

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
} 