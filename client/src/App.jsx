import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/signin'
import SignOut from './pages/SignUp'
import Profile from './pages/profile'
import About from './pages/about'
import Header from './Components/header'
import Register from './pages/register'
import PrivateRoute from './Components/PrivateRoute'
import Footer from './Components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignOut/>}/>
      <Route path='/about' element={<About/>}/>

      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      </Route>
      <Route path='/register' element={<Register/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
 