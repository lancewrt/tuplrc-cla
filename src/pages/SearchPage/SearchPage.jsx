import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ResourceBook from '../../components/ResourceBook/ResourceBook';
import './SearchPage.css'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Footer from '../../components/Footer/Footer'
import { setTypeArray } from '../../features/typeSlice';
import { setDeptArray } from '../../features/deptSlice';
import { setTopicArray } from '../../features/topicSlice';
import { fetchResources, setResource, setSearchQuery } from '../../features/resourceSlice';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import { setAdvancedSearch } from '../../features/advancedSearchSlice';

const fadeIn = {    
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2} },
};

const SearchPage = () => {
    const dispatch = useDispatch();
    // get query from URL
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    // Get the 'filter' query parameter
    const filter = queryParams.get('filter');
    const searchType = queryParams.get('type');

    // array from letter A-Z
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    // resource
    const {resource, loading, searchQuery, searchPerformed} = useSelector(state=>state.resource);
    const {type} = useSelector(state=>state.type)
    const {dept} = useSelector(state=>state.dept)
    const {topic} = useSelector(state=>state.topic)
    const [resourceType, setResourceType] = useState([]);
    const [department, setDepartment] = useState([]);
    const [topics, setTopics] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        type: type,
        dept: dept,
        topic: topic
    });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    
    // Sorting state
    const [sortOption, setSortOption] = useState('recent');
    
    // A-Z filter state
    const [activeLetterFilter, setActiveLetterFilter] = useState('');
    
    // Filtered and sorted resources
    const [displayedResources, setDisplayedResources] = useState([]);
    
    // Reference to all checkboxes
    const checkboxRefs = useRef({
        type: {},
        dept: {},
        topic: {}
    });

    // advanced search results
    const {advancedSearch, isSearch} = useSelector(state=>state.advancedSearch)
    
    // Back to top button visibility state
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    // Mobile filter visibility state
    const [showFilters, setShowFilters] = useState(false);
    
    // Window width state for responsiveness
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if(isSearch && advancedSearch.length > 0){
            dispatch(setResource(advancedSearch))
        }
    }, [advancedSearch, resource]);
    
    useEffect(() => {
        setSearchFilters({
            type: type,
            dept: dept,
            topic: topic
        });
    }, [type, dept, topic]);

    useEffect(() => {
        if (resourceType.length && department.length && topics.length) {
            // Uncheck all checkboxes first
            Object.values(checkboxRefs.current.type).forEach(checkbox => checkbox.checked = false);
            Object.values(checkboxRefs.current.dept).forEach(checkbox => checkbox.checked = false);
            Object.values(checkboxRefs.current.topic).forEach(checkbox => checkbox.checked = false);
    
            // Check only those that exist in searchFilters
            searchFilters.type.forEach(typeId => {
                if (checkboxRefs.current.type[typeId]) {
                    checkboxRefs.current.type[typeId].checked = true;
                }
            });
    
            searchFilters.dept.forEach(deptId => {
                if (checkboxRefs.current.dept[deptId]) {
                    checkboxRefs.current.dept[deptId].checked = true;
                }
            });
    
            searchFilters.topic.forEach(topicId => {
                if (checkboxRefs.current.topic[topicId]) {
                    checkboxRefs.current.topic[topicId].checked = true;
                }
            });
        }
    }, [resourceType, department, topics, searchFilters, filter]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        getType();
        getDept();
        getTopics();
        dispatch(fetchResources({ searchQuery: searchQuery, type, dept, topic }));

        // Add resize event listener for responsiveness
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // Auto show filters on desktop
            if (window.innerWidth >= 992) { 
                setShowFilters(true);
            } else {
                setShowFilters(false);
            }
        };

        // Add scroll event listener for back to top button
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        
        // Initial check for desktop or mobile
        handleResize();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if(!filter){
            return;
        }
        dispatch(fetchResources({ searchQuery: searchQuery, type, dept, topic }));
    }, [filter]);

    useEffect(() => {
        dispatch(setTypeArray(searchFilters.type));
        dispatch(setDeptArray(searchFilters.dept));
        dispatch(setTopicArray(searchFilters.topic));
        dispatch(fetchResources({ searchQuery: searchQuery, type, dept, topic }));
    }, [searchFilters, dispatch]);
    
    // Apply filters and sorting to resources
    useEffect(() => {
        let filteredResults = [...resource];
        
        // Apply A-Z filter if active
        if (activeLetterFilter) {
            filteredResults = filteredResults.filter(item => 
                item.resource_title.toLowerCase().startsWith(activeLetterFilter.toLowerCase())
            );
        }
        
        // Apply sorting
        switch (sortOption) {
            case 'recent':
                filteredResults.sort((a, b) => b.resource_published_date - a.resource_published_date);
                break;
            case 'title_asc':
                filteredResults.sort((a, b) => a.resource_title.localeCompare(b.resource_title));
                break;
            case 'title_desc':
                filteredResults.sort((a, b) => b.resource_title.localeCompare(a.resource_title));
                break;
            default:
                break;
        }
        
        setDisplayedResources(filteredResults);
        setCurrentPage(1); // Reset to first page when filters change
    }, [resource, activeLetterFilter, sortOption]);
    
    const getType = async() => {
        try {
            const response = await axios.get('https://api.tuplrc-cla.com/api/data/type').then(res=>res.data);
            setResourceType(response);
        } catch (err) {
            console.log(err.message);
        }
    };
    
    const getDept = async() => {
        try{
            const response = await axios.get('https://api.tuplrc-cla.com/api/data/departments').then(res=>res.data);
            setDepartment(response);
        }catch(err){
            console.log("Couldn't retrieve department online. An error occurred: ", err.message);
        }
    };
    
    const getTopics = async() => {
        try{
            const response = await axios.get('https://api.tuplrc-cla.com/api/data/topic').then(res=>res.data);
            setTopics(response);
        }catch(err){
            console.log("Couldn't retrieve topics online. An error occurred: ", err.message);
        }
    };

    // Handle Checkbox Change
    const handleCheckbox = (e, itemId, category) => {
        const { checked } = e.target;
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            [category]: checked 
                ? [...prevFilters[category], itemId] 
                : prevFilters[category].filter(id => id !== itemId)
        }));
    };
    
    // Reset all filters
    const handleResetFilters = () => {
        setSearchFilters({
            type: [],
            dept: [],
            topic: []
        });
        
        dispatch(setTypeArray([]));
        dispatch(setDeptArray([]));
        dispatch(setTopicArray([]));
        dispatch(setSearchQuery(''));
        dispatch(setAdvancedSearch([]));
        
        setSortOption('recent');
        setActiveLetterFilter('');
        
        Object.keys(checkboxRefs.current).forEach(category => {
            Object.values(checkboxRefs.current[category]).forEach(checkbox => {
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
        });
        
        dispatch(fetchResources({ searchQuery: '', type: [], dept: [], topic: [] }));
    };
    
    // Handle A-Z filter
    const handleLetterFilter = (letter) => {
        setActiveLetterFilter(activeLetterFilter === letter ? '' : letter);
    };
    
    // Handle sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    
    // Save checkbox reference
    const saveCheckboxRef = (element, itemId, category) => {
        if (!checkboxRefs.current[category]) {
            checkboxRefs.current[category] = {};
        }
        checkboxRefs.current[category][itemId] = element;
    };

    // Toggle filters visibility for mobile
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = displayedResources.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedResources.length / itemsPerPage);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        
        // For mobile, show fewer pagination buttons
        const isMobile = windowWidth < 768;
        const maxButtons = isMobile ? 3 : 5;
        
        // Previous button
        buttons.push(
            <button 
                key="prev" 
                className={`btn ${currentPage === 1 ? 'btn-secondary disabled' : 'btn-outline-dark'}`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                aria-label="Previous page"
            >
                &laquo;
            </button>
        );
        
        // Calculate page range to display
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        // Adjust start if end is maxed out
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        // First page ellipsis
        if (startPage > 1) {
            buttons.push(
                <button
                    key="first"
                    className="btn btn-outline-dark"
                    onClick={() => paginate(1)}
                >
                    1
                </button>
            );
            
            if (startPage > 2) {
                buttons.push(<span key="ellipsis1" className="px-2">...</span>);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`btn ${currentPage === i ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => paginate(i)}
                >
                    {i}
                </button>
            );
        }
        
        // Last page ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis2" className="px-2">...</span>);
            }
            
            buttons.push(
                <button
                    key="last"
                    className="btn btn-outline-dark"
                    onClick={() => paginate(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
        
        // Next button
        buttons.push(
            <button 
                key="next" 
                className={`btn ${currentPage === totalPages ? 'btn-secondary disabled' : 'btn-outline-dark'}`}
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                aria-label="Next page"
            >
                &raquo;
            </button>
        );
        
        return buttons;
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Calculate columns for grid based on screen size
    const getGridColumns = () => {
        if (windowWidth < 576) return 1; // xs
        if (windowWidth < 768) return 2; // sm
        return 3; // md and up
    };
    
    const gridColumns = getGridColumns();

    return (
        <div className='search-container'>
            <motion.div className='top-welcome p-2 text-center' variants={fadeIn}>
                <p className="m-0">Welcome to College of Liberal Arts' Online Catalog!</p>
            </motion.div>

            <div className='border border-bottom-1'>
                <Navbar query={searchQuery}/> 
            </div>

            {/* advanced search */}
            {searchType && <AdvancedSearch/>}

            <div className="container my-4 my-md-5">
                {/* back */}
                <div className='mb-3 mb-md-5'>
                    <Link className='text-decoration-none text-dark' to='/'>
                        <p className="d-flex align-items-center">
                            Back to Home
                        </p>
                    </Link>
                </div>
                
                <div className="row">
                    {/* Mobile filter toggle button */}
                    <div className="col-12 d-lg-none mb-3">
                        <button 
                            className="btn btn-outline-dark w-100"
                            onClick={toggleFilters}
                        >
                            <i className={`fa-solid fa-filter me-2`}></i>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                    
                    {/* Filters sidebar */}
                    <div className={`col-lg-3 mb-4 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
                        <div className="filter-sidebar p-3  rounded">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="m-0 open-sans">Filters</h4>
                                <button 
                                    className="btn btn-sm btn-outline-dark d-lg-none"
                                    onClick={toggleFilters}
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            
                            {/* resource type */}
                            <div className='d-flex flex-column mb-4'>
                                <h5 className='m-0 mb-2 open-sans'>Resource Type</h5>
                                <div className="filter-group">
                                    {resourceType.map(item => (
                                        <div className='d-flex gap-2 mb-1' key={`type-${item.type_id}`}>
                                            <input 
                                                type="checkbox" 
                                                id={`type-${item.type_id}`}
                                                name="type" 
                                                ref={el => saveCheckboxRef(el, item.type_id, 'type')}
                                                onChange={(e) => handleCheckbox(e, item.type_id, 'type')}
                                            /> 
                                            <label htmlFor={`type-${item.type_id}`} className='text-capitalize filter open-sans'>
                                                {item.type_name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* department */}
                            <div className='d-flex flex-column mb-4'>
                                <h5 className='m-0 mb-2 open-sans'>Department</h5>
                                <div className="filter-group">
                                    {department && department.map(item => (
                                        <div className='d-flex gap-2 mb-1' key={`dept-${item.dept_id}`}>
                                            <input 
                                                type="checkbox" 
                                                id={`dept-${item.dept_id}`}
                                                name="dept" 
                                                ref={el => saveCheckboxRef(el, item.dept_id, 'dept')}
                                                onChange={(e) => handleCheckbox(e, item.dept_id, 'dept')}
                                            /> 
                                            <label htmlFor={`dept-${item.dept_id}`} className='text-capitalize filter open-sans'>
                                                {item.dept_name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* topics */}
                            <div className='d-flex flex-column mb-4'>
                                <h5 className='m-0 mb-2 open-sans'>Topic</h5>
                                <div className="filter-group">
                                    {topics.map(item => (
                                        <div className='d-flex gap-2 mb-1' key={`topic-${item.topic_id}`}>
                                            <input 
                                                type="checkbox" 
                                                id={`topic-${item.topic_id}`}
                                                name="topic" 
                                                ref={el => saveCheckboxRef(el, item.topic_id, 'topic')}
                                                onChange={(e) => handleCheckbox(e, item.topic_id, 'topic')}
                                            /> 
                                            <label htmlFor={`topic-${item.topic_id}`} className='text-capitalize filter open-sans'>
                                                {item.topic_name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                className="btn btn-outline-dark w-100"
                                onClick={handleResetFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                    
                    {/* Results area */}
                    <div className="col-lg-9">
                        {/* search header */}
                        <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3'>
                            <div className="mb-3 mb-md-0">
                                <h1 className='m-0 fw-semibold fs-3 fs-md-2'>
                                    {searchQuery.length > 0 && searchPerformed ? `Search results for: ${searchQuery}` : `Results Found`}
                                </h1>
                                {searchQuery.length > 0 && searchPerformed && (
                                    <p className="m-0">A total of {displayedResources.length} resource{displayedResources.length !== 1 ? 's' : ''} found for "{searchQuery}"</p>
                                )}
                            </div>
                            
                            <div className='d-flex align-items-center'>
                                <select 
                                    className='form-select' 
                                    value={sortOption} 
                                    onChange={handleSortChange}
                                    aria-label="Sort options"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="title_asc">Title (A-Z)</option>
                                    <option value="title_desc">Title (Z-A)</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* A-Z filter */}
                        <div className='alphabet-filter mb-4 p-2'>
                            <div className='d-flex w-100 flex-wrap justify-content-center'>
                                {alphabet.map(letter => (
                                    <button 
                                        className={`btn btn-sm px-1 px-md-2 text-capitalize fw-semibold ${activeLetterFilter === letter ? 'btn-dark text-white' : ''}`}
                                        key={letter}
                                        onClick={() => handleLetterFilter(letter)}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                            {activeLetterFilter && (
                                <div className="text-center mt-2">
                                    <button 
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setActiveLetterFilter('')}
                                    >
                                        Clear Letter Filter
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Resource grid */}
                        <div className='row gy-4'>
                            {currentItems.length > 0 ? (
                                currentItems.map(item => (
                                    <div className="col-12 col-sm-6 col-lg-4 mb-3 d-flex justify-content-center" key={item.resource_id}>
                                        <Link 
                                            to={searchType ? `/view/${item.resource_id}?type=advanced search` : `/view/${item.resource_id}`} 
                                            className='text-decoration-none w-100'
                                        >
                                            <motion.div 
                                                whileHover={{ scale: 1.03 }}
                                                transition={{ duration: 0.2 }}
                                                className="d-flex justify-content-center"
                                            >
                                                <ResourceBook loading={loading} data={item}/>  
                                            </motion.div>
                                        </Link>               
                                    </div>
                                ))
                            ) : (
                                <div className='col-12 d-flex flex-column align-items-center text-center py-5'>
                                    <i className="fa-solid fa-circle-exclamation fs-2 mb-3"></i>
                                    <p className="m-0 fw-semibold">No resources found.</p>
                                    <p className="m-0 text-secondary mb-3">Please try different filter options.</p>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={handleResetFilters}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Pagination */}
                        {displayedResources.length > 0 && (
                            <div className="d-flex flex-column align-items-center mt-4 mt-md-5">
                                <div className="pagination-container overflow-auto py-2 mb-3">
                                    <div className="d-flex">
                                        {renderPaginationButtons()}
                                    </div>
                                </div>
                                
                                {/* Items per page selector */}
                                <div className="d-flex align-items-center">
                                    <label className="me-2">Items per page:</label>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={itemsPerPage} 
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        style={{ width: '70px' }}
                                        aria-label="Items per page"
                                    >
                                        <option value="6">6</option>
                                        <option value="9">9</option>
                                        <option value="12">12</option>
                                        <option value="24">24</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <motion.div 
                    className="back-to-top"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 999,
                        cursor: 'pointer',
                        backgroundColor: '#343a40',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}
                    aria-label="Back to top"
                >
                    <i className="fa-solid fa-arrow-up"></i>
                </motion.div>
            )}

            <Footer />
        </div>
    )
}

export default SearchPage;