import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {type} = useSelector(state=>state.type)
  const {dept} = useSelector(state=>state.dept)
  const {topic} = useSelector(state=>state.topic)
  const {resource, searchQuery, searchPerformed} = useSelector(state=>state.resource);
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchKeyword.length !== 0) {
        getSearch();
    }
  };

  const getSearch = async() => {
    if(searchKeyword !== '') {
      dispatch(setSearchPerformed(true))
      dispatch(setSearchQuery(searchKeyword));
      dispatch(fetchResources({ searchQuery: searchKeyword, type, dept, topic }));
      navigate('/search')
      setIsMenuOpen(false); // Close menu after search on mobile
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  // Menu item handler
  const handleMenuClick = (filterType, filterName) => {
    dispatch(setTypeArray([filterType]));
    navigate(`/search?filter=${filterName}`);
    setIsMenuOpen(false); // Close menu after selection on mobile
  }

  useEffect(() => {
    setSearchKeyword(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if(searchPerformed && searchKeyword === '') {
      dispatch(fetchResources({ searchQuery: searchKeyword, type, dept, topic }));
      dispatch(setSearchPerformed(false))
    }
  }, [searchKeyword])
  
  return (
    <nav className='navbar-box container py-2 py-lg-3'>
      {/* logo and hamburger menu */}
      <div className='row position-relative'>
        <div className='d-flex justify-content-between align-items-center'>
          <Link className='text-decoration-none' to='/'>
            <p className='m-0 logo'>Liberal<span>Search</span>.</p>
          </Link>
          
          {/* Desktop search - only visible on desktop */}
          <div className='d-none d-lg-block col-lg-4'>
            {!searchType && <div className='row search m-auto'>
              <input 
                type="text" 
                placeholder='Search for resources' 
                onChange={(e)=>setSearchKeyword(e.target.value)} 
                onKeyDown={handleKeyDown} 
                value={searchKeyword} 
                className='col'
              />
              <button className="col-3" onClick={getSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>}
          </div>
          
          {/* Hamburger menu button - only visible on mobile */}
          <button 
            className='hamburger-btn d-lg-none'
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
      
      {/* menu - desktop version */}
      <div className="menu d-none d-lg-flex align-items-center mt-2 justify-content-start">
        <button
          onClick={() => handleMenuClick(1, 'Books')}
          className='me-3'
        >
          Books
        </button>
        <span className='me-3'>|</span>
        <button
          onClick={() => handleMenuClick(2, 'Journals')}
          className='me-3'
        >
          Journals
        </button>
        <span className='me-3'>|</span>
        <button
          onClick={() => handleMenuClick(3, 'Newsletters')}
          className='me-3'
        >
          Newsletters
        </button>
        <span className='me-3'>|</span>
        <button
          onClick={() => handleMenuClick(4, 'Theses and Dissertations')}
        >
          Theses & Dissertations
        </button>
      </div>
      
      {/* Mobile menu - slides down when hamburger is clicked */}
      <div className={`mobile-menu d-lg-none ${isMenuOpen ? 'show' : ''}`}>
        {/* Mobile search bar - inside hamburger menu */}
        {!searchType && <div className='p-3 pb-2'>
          <div className='row search m-auto'>
            <input 
              type="text" 
              placeholder='Search for resources' 
              onChange={(e)=>setSearchKeyword(e.target.value)} 
              onKeyDown={handleKeyDown} 
              value={searchKeyword} 
              className='col'
            />
            <button className="col-3" onClick={getSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>}
        
        {/* Mobile menu items */}
        <div className="d-flex flex-column px-3 pb-3">
          <button
            onClick={() => handleMenuClick(1, 'Books')}
            className='mb-2 mobile-menu-item'
          >
            Books
          </button>
          <button
            onClick={() => handleMenuClick(2, 'Journals')}
            className='mb-2 mobile-menu-item'
          >
            Journals
          </button>
          <button
            onClick={() => handleMenuClick(3, 'Newsletters')}
            className='mb-2 mobile-menu-item'
          >
            Newsletters
          </button>
          <button
            onClick={() => handleMenuClick(4, 'Theses and Dissertations')}
            className='mobile-menu-item'
          >
            Theses & Dissertations
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar