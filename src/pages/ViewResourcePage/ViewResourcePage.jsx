import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'; // Import Framer Motion
import Navbar from '../../components/Navbar/Navbar';
import { Link, useLocation, useParams } from 'react-router-dom';
import './ViewResourcePage.css'
import sample from '../../assets/OPAC/photos/samplebook.jpg'
import ResourceBook from '../../components/ResourceBook/ResourceBook';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Import navigation styles

// Import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import axios from 'axios';
import Footer from '../../components/Footer/Footer'

const fadeIn = {    
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2} },
};

const ViewResourcePage = () => {
    // get query from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchType = queryParams.get('type');

    const [resource, setResource] =useState([])
    const [resourceLoading, setResourceLoading] =useState([])
    const [relatedBooks, setRelatedBooks] = useState([])
    const [relatedBooksLoading, setRelatedBooksLoading] = useState(false)
    const [preview, setPreview] = useState()
    const {id} = useParams()

    console.log(id)

    useEffect(() => {
        if (!resource) return;
    
        if (resource.type_id != 4) {
          let objectUrl;
          try {
            objectUrl = URL.createObjectURL(resource.filepath);
            setPreview(objectUrl);
          } catch {
            if (resource.filepath?.includes("http://books.google.com")) {
              setPreview(resource.filepath);
            } else {
              setPreview(`https://api.tuplrc-cla.com/${resource.filepath}`);
            }
          }
    
          // Cleanup function to revoke the Object URL
          return () => {
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
          };
        }
    }, [resource]);

    useEffect(()=>{
        window.scrollTo(0, 0);
        
        getResource()
    },[id])

    const getResource = async()=>{
        setRelatedBooksLoading(true)
        setRelatedBooksLoading(true)
        try {
            const response = await axios.get(`https://api.tuplrc-cla.com/api/online-catalog/${id}`).then(res=>res.data);
            console.log(response)
            setResource(response.results[0])
            setRelatedBooks(response.relatedBooks)
        } catch (error) {
            console.log(`Cannot get the resource with ${id}.`, error)
        } finally{
            setTimeout(()=>{
                setRelatedBooksLoading(false)
                setRelatedBooksLoading(false)
            },3000)
        }
    }

  return (
    <div className='view-container'>
        <motion.div className='top-welcome p-2 text-center' variants={fadeIn}>
            <p className="m-0">Welcome to College of Liberal Arts' Online Catalog!</p>
        </motion.div>

        <div className='border border-bottom-1'>
            <Navbar/> 
        </div>

        {/* content */}
        <div className="container my-5">
            {/* path */}
            <div className='mb-5'>
                <Link className='text-decoration-none text-dark' to={searchType?'/search?type=advanced search':'/search'}><p>Go to Search</p></Link>
            </div>

            <div className="container book-info m-auto w-75 row">
                {/* book info */}
                <div className="col-6 h-100 d-flex flex-column align-items-start gap-3">
                    {/* availability */}
                    {resource && typeof resource.resource_quantity !== 'undefined' && (
                        <div
                            className={`fw-semibold availability text-light d-flex align-items-center py-2 px-4 rounded-pill 
                                ${resource.resource_quantity === 0 ? 'bg-danger' : 'bg-success'}`}
                        >
                            {resource.resource_quantity === 0 ? 'Borrowed' : 'Available'}
                        </div>
                    )}
                    {/* title */}
                    <div>
                        {resource && resource.resource_title && (
                            <>
                                {resource.resource_title.length < 20 ? (
                                <h1 className="m-0 fw-bold text-capitalize">{resource.resource_title}</h1>
                                ) : (
                                <h4 className="m-0 fw-bold text-capitalize">{resource.resource_title}</h4>
                                )}
                                <p className="m-0 author">by {resource.authors == "N/A N/A" || resource.authors == "n/a n/a" ? "Unknown Author" : resource.authors}</p>
                            </>
                        )}
                    </div>
                   
                    {/* published date */}
                    <div>
                        <h5 className='m-0 info-label'>Published Date</h5>
                        <p className="m-0 fs-5 info">{resource&&resource.resource_published_date}</p>
                    </div>
                    {/* Department */}
                    <div>
                        <h5 className='m-0 info-label'>Department</h5>
                        <p className="m-0 fs-5 info text-capitalize">{resource&&resource.dept_name}</p>
                    </div>
                    {/* Topic */}
                    <div>
                        <h5 className='m-0 info-label'>Topic</h5>
                        <p className="m-0 fs-5 info text-capitalize">
                        {resource?.topic_name?.trim() ? resource.topic_name : "Unknown topic"}
                        </p>
                    </div>
                    {/* shelf */}
                    <div>
                        <h5 className='m-0 info-label'>Shelf No.</h5>
                        <p className="m-0 fs-5 info">{resource&&resource.dept_shelf_no}</p>
                    </div>
                    {/* row */}
                    <div>
                        <h5 className='m-0 info-label'>Row No.</h5>
                        <p className="m-0 fs-5 info text-capitalize">
                        {resource?.topic_row_no?.trim() ? resource.topic_row_no : "Unknown row number"}
                        </p>
                    </div>
                    {resource&&resource.resource_is_circulation==1
                    ?<p className="m-0 fst-italic text-danger fw-semibold">This resource can be borrowed and is not limited to use within the premises.</p>:<p className="m-0 fst-italic text-danger">This resource cannot be borrowed and is limited to use within the premises.</p>}
                    
                </div>
                {/* book cover */}
                <div className="col-6 h-100">
                    {resource&&resource.type_id!=4
                    ?<img src={preview} alt="" className='book-cover rounded shadow'/>
                    :<div className='thesis-cover d-flex justify-content-center align-items-center text-light p-5 text-center text-uppercase rounded shadow'>
                        {resource.resource_title}
                    </div>}
                </div>
            </div>
            {/* related resource */}
            <div className="row m-auto mt-5">
                <h4 className='fw-semibold'>Related Resource</h4>
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
                    {Array.isArray(relatedBooks) &&
                        relatedBooks.map((item) => (
                        <SwiperSlide key={item.resource_id}>
                            <Link to={`/view/${item.resource_id}`} className='text-decoration-none'>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                   <ResourceBook loading={relatedBooksLoading} data={item} /> 
                                </motion.div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
            </div>
        </div>

        {/* footer */}
        <Footer/>

    </div>
  )
}

export default ViewResourcePage
