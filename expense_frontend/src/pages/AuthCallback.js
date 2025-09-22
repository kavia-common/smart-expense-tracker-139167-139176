import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../services/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Auth callback error:', error)
        navigate('/auth/error', { replace: true })
        return
      }
      if (data?.session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
    handleAuthCallback()
  }, [navigate])

  return <div className="screen-center"><div className="card">Processing authentication…</div></div>
}
