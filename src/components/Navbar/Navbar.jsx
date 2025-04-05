import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources, setSearchPerformed, setSearchQuery } from '../../features/resourceSlice';
import { setTypeArray } from '../../features/typeSlice';

const Navbar = ({query}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get query from URL
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const searchType = queryParams.get('type');
  const [searchKeyword, setSearchKeyword] = useState('');
  const {type} = useSelector(state=>state.type)
  const {dept} = useSelector(state=>state.dept)
  const {topic} = useSelector(state=>state.topic)
  const {resource,searchQuery,searchPerformed} = useSelector(state=>state.resource);
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchKeyword.length!='') {
        getSearch();
    }
  };

  const getSearch = async()=>{
    if(searchKeyword!=''){
      dispatch(setSearchPerformed(true))
      dispatch(setSearchQuery(searchKeyword));
      dispatch(fetchResources({ searchQuery: searchKeyword, type, dept, topic })); // Pass as an object
      navigate('/search')
    }
  }

  useEffect(()=>{
    setSearchKeyword(searchQuery)
  },[searchQuery])

  useEffect(()=>{
    if(searchPerformed&&searchKeyword==''){
      // dispatch(setSearchQuery(searchKeyword));
      dispatch(fetchResources({ searchQuery: searchKeyword, type, dept, topic })); // Pass as an object
      dispatch(setSearchPerformed(false))
    }

  },[searchKeyword])

  console.log(searchKeyword)
  console.log(resource)
  
  return (
    <nav className='navbar-box container py-4 py-lg-3'>
      {/* logo and search bar */}
      <div className='row'>
        <Link className='text-decoration-none col-12 col-lg-8' to='/'>
          <p className='m-0 logo text-center text-lg-start'>Liberal<span>Search</span>.</p>
        </Link>
        {/* search */}
        <div className='col-12 col-lg-4'>
          {!searchType&&<div className='row search m-auto '>
              {/* input */}
              <input type="text" placeholder='Search for resources' onChange={(e)=>setSearchKeyword(e.target.value)} onKeyDown={handleKeyDown} value={searchKeyword} className='col'/>
              {/* search button */}
              <button className="col-3" onClick={getSearch}>
                  <i class="fa-solid fa-magnifying-glass"></i>
              </button>
          </div>}
        </div>
        
      </div>
      {/* menu */}
      <div className="menu d-flex align-items-center mt-2 justify-content-center justify-content-lg-start">
        <button
          onClick={()=>{
            dispatch(setTypeArray([1]))
            navigate(`/search?filter=Books`)
          }}
          className='me-2 me-lg-3'
        >
          Books
        </button>
        <span className='me-2 me-lg-3'>|</span>
        <button
          onClick={()=>{
            dispatch(setTypeArray([2]))
            navigate(`/search?filter=Journals`)
          }}
          className='me-2 me-lg-3'
        >
          Journals
        </button>
        <span className='me-2 me-lg-3'>|</span>
        <button
          onClick={()=>{
            dispatch(setTypeArray([3]))
            navigate(`/search?filter=Newsletters`)
          }}
          className='me-2 me-lg-3'
        >
          Newsletters
        </button>
        <span className='me-2 me-lg-3'>|</span>
        <button
          onClick={()=>{
            dispatch(setTypeArray([4]))
            navigate(`/search?filter=Theses and Dissertations`)
          }}
          className=''
        >
          Theses & Dissertations
        </button>
      </div>
    </nav>
  )
}

export default Navbar
