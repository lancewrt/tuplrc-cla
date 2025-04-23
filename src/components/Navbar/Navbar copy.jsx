import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources, setSearchPerformed, setSearchQuery } from '../../features/resourceSlice';
import { setTypeArray } from '../../features/typeSlice';

const Navbar = ({ query }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const searchType = queryParams.get('type');
  const [searchKeyword, setSearchKeyword] = useState('');
  const {type} = useSelector(state=>state.type)
  const {dept} = useSelector(state=>state.dept)
  const {topic} = useSelector(state=>state.topic)
  const {resource,searchQuery,searchPerformed} = useSelector(state=>state.resource);
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchKeyword !== '') {
      getSearch()
    }
  }

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
    <nav className='navbar navbar-expand-lg bg-white'>
      <div className='container navbar-box py-3'>

        {/* Logo */}
        <Link className='text-decoration-none' to='/'>
          <p className='logo m-0'>Liberal<span>Search</span>.</p>
        </Link>

        {/* Hamburger Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse " id="navbarContent">

          {/* Search */}
          {!searchType && (
            <div className='d-flex search ms-lg-auto mt-3 mt-lg-0'>
              <input
                type="text"
                placeholder='Search for resources'
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                value={searchKeyword}
              />
              <button onClick={getSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          )}

          {/* Menu buttons */}
          <div className="menu d-flex flex-column flex-lg-row gap-3 mt-3 mt-lg-2 ms-lg-4">
            <button onClick={() => {
              dispatch(setTypeArray([1]))
              navigate(`/search?filter=Books`)
            }}>
              Books
            </button>
            <span className='d-none d-lg-inline'>|</span>
            <button onClick={() => {
              dispatch(setTypeArray([2]))
              navigate(`/search?filter=Journals`)
            }}>
              Journals
            </button>
            <span className='d-none d-lg-inline'>|</span>
            <button onClick={() => {
              dispatch(setTypeArray([3]))
              navigate(`/search?filter=Newsletters`)
            }}>
              Newsletters
            </button>
            <span className='d-none d-lg-inline'>|</span>
            <button onClick={() => {
              dispatch(setTypeArray([4]))
              navigate(`/search?filter=Theses and Dissertations`)
            }}>
              Theses & Dissertations
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
