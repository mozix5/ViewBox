import React from 'react'
import Hero from '../components/Hero'
import Row from '../components/Row'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className=' bg-[#000000] w-full overflow-x-hidden h-full'>
    {/* <Navbar/> */}
        <Hero/>

        <Row title='upcoming'/>
        <Row title='popular'/>
        <Row title='trending'/>
        <Row title='top_rated'/>
        <Row title='horror'/>
    </div>
  )
}

export default Home
