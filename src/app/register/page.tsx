'use client'

import React,{ useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function RegisterPage() {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confrimPassword,setConfrimPassword] = useState('')
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password != confrimPassword){
      setError("Passwords don't match");
      return;
    }
    try{
      setLoading(true)
      const res = await axios.post('/api/auth/register', { name, email, password })
      setMessage(res.data?.message || 'Register Success!!')
      setName('')
      setEmail('')
      setPassword('')
      setConfrimPassword('')
      e.target.reset()
      console.log(res.data)
      router.push('/login')
    }catch (err) {
      console.log(err?.res?.data)
      setError(err?.res?.data?.message || err.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }

  }
  return (
    <div>
      
      <div className='container mx-auto'>
        <form onSubmit={handleSubmit}>
          <label >Name
            <input className='block' type="text" onChange={(e) => setName(e.target.value)} required/>
          </label>
          <label >Email
            <input className='block' type="email" onChange={(e) => setEmail(e.target.value)} required/>
          </label>
          <label >Password
            <input className='block' type="password" onChange={(e) => setPassword(e.target.value)}  required/>
          </label>
          <label >ConfrimPassword
            <input className='block' type="password" onChange={(e) => setConfrimPassword(e.target.value)} required/>
          </label>
          { error && <p>{error}</p>}
          { message && <p>{message}</p>}
          <button type="submit"> {loading ? 'Registering...' : 'Register'}</button>
         
        </form>
      </div>
    </div>
  )
}

export default RegisterPage