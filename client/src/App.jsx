import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignOut from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './Components/Header'
import Register from './pages/Register'
import PrivateRoute from './Components/PrivateRoute'
import Footer from './Components/Footer'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing.jsx';
import Listing from './pages/listing';
import Search from './pages/Search';


export default function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignOut/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/search' element={<Search />} />
      <Route path='/listing/:listingId' element={<Listing />} />

      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<CreateListing/>}/>
      <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
      </Route>
      <Route path='/register' element={<Register/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
 