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

    const [resource, setResource] = useState([])
    const [resourceLoading, setResourceLoading] = useState(true)
    const [relatedBooks, setRelatedBooks] = useState([])
    const [relatedBooksLoading, setRelatedBooksLoading] = useState(false)
    const [preview, setPreview] = useState()
    const {id} = useParams()

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

    useEffect(() => {
        window.scrollTo(0, 0);
        getResource()
    }, [id])

    const getResource = async() => {
        setResourceLoading(true)
        setRelatedBooksLoading(true)
        try {
            const response = await axios.get(`https://api.tuplrc-cla.com/api/online-catalog/${id}`).then(res => res.data);
            setResource(response.results[0])
            setRelatedBooks(response.relatedBooks)
        } catch (error) {
            console.log(`Cannot get the resource with ${id}.`, error)
        } finally {
            setTimeout(() => {
                setResourceLoading(false)
                setRelatedBooksLoading(false)
            }, 3000)
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
        <div className="container my-3 my-md-5 px-3 px-md-4">
            {/* path */}
            <div className='mb-3 mb-md-5'>
                <Link className='text-decoration-none text-dark' to={searchType ? '/search?type=advanced search' : '/search'}>
                    <p className="mb-0">Go to Search</p>
                </Link>
            </div>

            <div className="resource-container book-info mx-auto w-100 w-md-75 row gy-4">
                {/* book cover */}
                <div className="col-12 col-md-6 col-lg-6 order-1 order-md-2 d-flex justify-content-center align-items-start">
                    {resourceLoading ? (
                        <div className="placeholder-glow w-75 aspect-ratio-4x3">
                            <div className="placeholder w-100 h-100"></div>
                        </div>
                    ) : resource && resource.type_id !== 4 ? (
                        <img src={preview} alt={resource.resource_title} className='book-cover img-fluid rounded shadow' />
                    ) : (
                        <div
                            className="thesis-cover-pic d-flex justify-content-center align-items-center text-light p-4 p-md-5 text-center text-uppercase rounded"
                            >
                            {resource.resource_title}
                        </div>
                    )}
                </div>

                {/* book info */}
                <div className="col-12 col-md-6 col-lg-6 order-2 order-md-1 d-flex flex-column align-items-start gap-3">
                    {resourceLoading ? (
                        <div className="placeholder-glow w-100">
                            <div className="placeholder w-75 mb-3"></div>
                            <div className="placeholder w-50 mb-3"></div>
                            <div className="placeholder w-25 mb-3"></div>
                        </div>
                    ) : (
                        <>
                            {resource && typeof resource.resource_quantity !== 'undefined' && (
                                <div
                                    className={`availability text-light d-flex align-items-center py-1 py-md-2 px-3 px-md-4 rounded-pill 
                                        ${resource.resource_quantity === 0 ? 'bg-danger' : 'bg-success'}`}
                                >
                                    {resource.resource_quantity === 0 ? 'Borrowed' : 'Available'}
                                </div>
                            )}
                            <div className="w-100">
                                {resource && resource.resource_title && (
                                    <>
                                        {resource.resource_title.length < 20 ? (
                                            <h1 className="m-0 fw-bold text-capitalize fs-2 fs-md-1">{resource.resource_title}</h1>
                                        ) : (
                                            <h3 className="m-0 fw-bold text-capitalize fs-4 fs-md-3">{resource.resource_title}</h3>
                                        )}
                                        <p className="m-0 author">by {resource.authors}</p>
                                    </>
                                )}
                            </div>
                            <div className="info-section w-100">
                                <h5 className='m-0 info-label'>Published Date</h5>
                                <p className="m-0 fs-6 fs-md-5 info">{resource && resource.resource_published_date}</p>
                            </div>
                            <div className="info-section w-100">
                                <h5 className='m-0 info-label'>Department</h5>
                                <p className="m-0 fs-6 fs-md-5 info text-capitalize">{resource && resource.dept_name}</p>
                            </div>
                            <div className="info-section w-100">
                                <h5 className='m-0 info-label'>Topic</h5>
                                <p className="m-0 fs-6 fs-md-5 info text-capitalize">{resource && resource.topic_name}</p>
                            </div>
                            <div className="info-section w-100">
                                <h5 className='m-0 info-label'>Shelf No.</h5>
                                <p className="m-0 fs-6 fs-md-5 info">{resource && resource.dept_shelf_no}</p>
                            </div>
                            <div className="info-section w-100">
                                <h5 className='m-0 info-label'>Row No.</h5>
                                <p className="m-0 fs-6 fs-md-5 info">{resource && resource.topic_row_no}</p>
                            </div>
                            {resource && resource.resource_is_circulation == 1
                                ? <p className="m-0 fst-italic text-danger fs-6">This resource can be borrowed and is not limited to use within the premises.</p>
                                : <p className="m-0 fst-italic text-danger fs-6">This resource cannot be borrowed and is limited to use within the premises.</p>
                            }
                        </>
                    )}
                </div>
            </div>

            {/* related resource */}
            <div className="row mx-auto mt-4 mt-md-5">
                <h4 className='fw-semibold mb-3'>Related Resources</h4>
                {relatedBooksLoading ? (
                    <div className="placeholder-glow w-100">
                        <div className="d-flex flex-wrap gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="placeholder w-100 w-md-47 w-lg-23" style={{ height: '250px' }}></div>
                            ))}
                        </div>
                    </div>
                ) : (
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
                        {Array.isArray(relatedBooks) && relatedBooks.length > 0 ? (
                            relatedBooks.map((item) => (
                                <SwiperSlide key={item.resource_id}>
                                    <Link to={`/view/${item.resource_id}`} className='text-decoration-none'>
                                        <motion.div whileHover={{ scale: 1.05 }}>
                                           <ResourceBook loading={relatedBooksLoading} data={item} /> 
                                        </motion.div>
                                    </Link>
                                </SwiperSlide>
                            ))
                        ) : (
                            <div className="text-center w-100 py-4">
                                <p>No related resources found</p>
                            </div>
                        )}
                    </Swiper>
                )}
            </div>
        </div>

        {/* footer */}
        <Footer/>
    </div>
  )
}

export default ViewResourcePage