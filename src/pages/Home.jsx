import React from 'react'
import Hero from '../components/Hero'
import Row from '../components/Row'
import { requests } from '../assets/requests'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className=' bg-[#000000] w-full overflow-x-hidden h-full'> 
    {/* <Navbar/> */}
        <Hero/>
       
        <Row fetchURL={requests.requestUpcoming} title='upcoming'/>
        <Row fetchURL={requests.requestPopular} title='popular'/>
        <Row fetchURL={requests.requestTrending} title='popular'/>
        <Row fetchURL={requests.requestTopRated} title='top_rated'/>
        {/* <Row fetchURL={requests.requestHorror} title='horror'/> */}
    </div>
  )
}

export default Home