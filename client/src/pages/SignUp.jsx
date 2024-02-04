import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'


export default function SignUp(){
  const [formData,setFormData] = useState({})
  const [error,setErrors] = useState(null)
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()

  const handlechange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,

      }
    )
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup',
      {
        method:'POST',
        headers:{
          'content-type':'application/json',
  
        },
        body:JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        setLoading(false)
        setErrors(data.message);
        return;
      }
      setLoading(false);
      setErrors(null);
      // console.log(data)
      navigate('/sign-in')
    }catch(error){
      setLoading(false)
      setErrors(error.message);
    }

    }
  // console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold p-3 mb-1'>Sign-Up</h1>
      <form onSubmit={handleSubmit} action="text" className='flex flex-col gap-4'>
        <input type="text" placeholder='username'
        className='border p-3 rounded-lg' id='username' onChange={handlechange}/>
        <input type="email" placeholder='email'
        className='border p-3 rounded-lg' id='email' onChange={handlechange}/>
        <input type="password" placeholder='password'
        className='border p-3 rounded-lg' id='password' onChange={handlechange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'loading...':'SignUp'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>have an account?</p>
        <Link to={"sign-in"}>
          <span className='text-blue-700'>Sign-in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
