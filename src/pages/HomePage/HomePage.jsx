import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import './HomePage.css';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Import navigation styles

// Import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import ResourceBook from '../../components/ResourceBook/ResourceBook';
import Footer from '../../components/Footer/Footer';

import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTypeArray } from '../../features/typeSlice';
import { setTopicArray } from '../../features/topicSlice';
import { setDeptArray } from '../../features/deptSlice';
import { setSearchQuery } from '../../features/resourceSlice';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2} },
};

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const [mostBorrowedLoading, setMostBorrowedLoading] = useState(false)

  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredBooksLoading, setFeaturedBooksLoading] = useState(false);

  const [featuredDepartment, setFeaturedDepartment] = useState([]);
  const [featuredDepartmentLoading, setFeaturedDepartmentLoading] = useState(false)

  useEffect(()=>{
    window.scrollTo(0, 0);
    
    getMostBorrowed();
    getFeaturedBooks();
    getFeaturedDepartment();

    // reset redux states
    dispatch(setSearchQuery(''));
    dispatch(setTypeArray([]));
    dispatch(setDeptArray([]));
    dispatch(setTopicArray([]));
  },[])

  const getMostBorrowed = async ()=>{
    setMostBorrowedLoading(true)
    try {
      const response = await axios.get('https://api.tuplrc-cla.com/api/online-catalog/most-borrowed');
      setMostBorrowed(response.data)
      console.log(response)
    } catch (error) {
      console.log('Cannot fetch most borrowed books: ', error)
    } finally{
      setTimeout(()=>{
        setMostBorrowedLoading(false)
      },3000)
    }
  }

  const getFeaturedBooks = async () => {
    setFeaturedBooksLoading(true)
    try {
        const response = await axios.get('https://api.tuplrc-cla.com/api/online-catalog/featured-books');
        setFeaturedBooks(response.data);
    } catch (error) {
        console.error('Error retrieving featured books:', error.message);
    } finally{
      setTimeout(()=>{
        setFeaturedBooksLoading(false)
      },3000)
    }
  };

  const getFeaturedDepartment = async () => {
    setFeaturedDepartmentLoading(true)
    try {
        const response = await axios.get('https://api.tuplrc-cla.com/api/online-catalog/featured-department');
        setFeaturedDepartment(response.data);
    } catch (error) {
        console.error('Error retrieving featured books:', error.message);
    } finally{
      setTimeout(()=>{
        setFeaturedDepartmentLoading(false)
      },3000)
    }
  };

  console.log(featuredBooks)

  return (
    <motion.div 
      className='homepage-container'
      initial="hidden"
      animate="visible"
    >
      {/* top welcome */}
      <motion.div className='top-welcome p-2 text-center' variants={fadeIn}>
        <p className="m-0">Welcome to College of Liberal Arts’ Online Catalog!</p>
      </motion.div>

      {/* navbar */}
      <motion.div className='border border-1' variants={fadeIn}>
        <Navbar />
      </motion.div>

      {/* hero section with fade-in effect */}
      <motion.div variants={fadeIn}>
        <Hero />
      </motion.div>

      {/* Most Borrowed Books */}
      <motion.div className="container book-container" variants={fadeIn}>
        <div className='d-flex align-items-center justify-content-center mb-4'>
          <h4 className='fw-semibold fs-2 '>Most Borrowed Books</h4>
          {/* <button className="btn see-all fw-semibold">SEE MORE</button> */}
        </div>
        <Swiper
          slidesPerView={4}
          spaceBetween={5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 }, 
            1200: { slidesPerView: 4, spaceBetween: 25 },
          }}          
          navigation={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
        >
          <div className="most-borrowed-books">
            {Array.isArray(mostBorrowed)&&mostBorrowed.length>0
            ?mostBorrowed.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/view/${item.resource_id}`} className='text-decoration-none'>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <ResourceBook loading={mostBorrowedLoading} data={item}/>
                  </motion.div>
                </Link>
                
              </SwiperSlide>
            )):''}
          </div>
        </Swiper>
      </motion.div>

      {/* Featured Books */}
      <motion.div className="book-container px-4 container" variants={fadeIn}>
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <h4 className='fw-semibold fs-2'>Featured Books</h4>
          <button 
            className="btn see-all fw-semibold"
            onClick={()=>{
              dispatch(setTypeArray([1]))
              navigate(`/search?filter=Books`)
            }}>
            SEE MORE
          </button>
        </div>
        <Swiper
          slidesPerView={4}
          spaceBetween={5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 }, // changed from 3 to 4
            1200: { slidesPerView: 4, spaceBetween: 25 },
          }}
          
          navigation={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
        >
          <div className="most-borrowed-books">
            {Array.isArray(featuredBooks)&&featuredBooks.length>0
            ?featuredBooks.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/view/${item.resource_id}`} className='text-decoration-none'>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <ResourceBook loading={featuredBooksLoading} data={item}/>
                  </motion.div>
                </Link>

              </SwiperSlide>
            )):''}
          </div>
        </Swiper>
      </motion.div>

      {/* Theses and Dissertations */}
      <motion.div 
        className="banner d-flex text-center flex-column justify-content-center align-items-center gap-3"
        variants={fadeIn}
      >
        <h2 className='text-light fw-light fs-1'>
        <span>The Learning Resources Center</span>
        <br className="mobile-break" />
        also houses
        <br className="mobile-break" />
        Theses and Dissertations
        </h2>
        <p className="m-0 text-light fs-5 fw-light open-sans">
          Look for inspiration or ideas for your upcoming projects here
        </p>
        <motion.button 
          className="btn btn-outline-light text-light p-3 open-sans"
          whileHover={{ scale: 1.1 }}
          onClick={()=>{
            dispatch(setTypeArray([4]))
            navigate(`/search?filter=Theses and Dissertations`)
          }}
        >
          VIEW RESOURCES
        </motion.button>
      </motion.div>

      {/* Books under Hospitality */}
      <motion.div className="container book-container mb-5 pb-5" variants={fadeIn}>
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <h4 className='fw-semibold fs-2 '>Resources Under Hospitality and Restaurant Management </h4>
          <button 
            className="btn see-all fw-semibold"
            onClick={()=>{
              dispatch(setDeptArray([4]))
              navigate(`/search?filter=Hospitality and Restaurant Management`)
            }}>
            SEE MORE
          </button>
        </div>
        <Swiper
          slidesPerView={4}
          spaceBetween={5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 25 },
          }}
          navigation={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
        >
          <div className="most-borrowed-books">
            {Array.isArray(featuredDepartment)&&featuredDepartment.length>0
            ?featuredDepartment.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/view/${item.resource_id}`} className='text-decoration-none'>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <ResourceBook loading={featuredDepartmentLoading} data={item}/>
                  </motion.div>
                </Link>
              </SwiperSlide>
            )):''}
          </div>
        </Swiper>
      </motion.div>

      {/* footer */}
      <motion.div variants={fadeIn}>
        <Footer />
      </motion.div>

    </motion.div>
  );
};

export default HomePage;
