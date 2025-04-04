import React, { useState, useRef } from 'react'
import './AdvancedSearch.css'
import AddedFilter from '../AddedFilter/AddedFilter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdvancedSearchResources, setAdvancedSearch, setIsSearch } from '../../features/advancedSearchSlice'
import { useNavigate } from 'react-router-dom'
import { setTypeArray } from '../../features/typeSlice'
import { setDeptArray } from '../../features/deptSlice'
import { setTopicArray } from '../../features/topicSlice'
import { setSearchQuery } from '../../features/resourceSlice'

const AdvancedSearch = () => {
    const navigate = useNavigate()
    const {advancedSearch,loading} = useSelector(state=>state.advancedSearch)
    const [selectedType, setSelectedType] = useState('any')
    const [initialFilter, setInitialFilter] = useState({
        filter:'title',
        condition:'contains',
        input:''
    })
    const [addedFilters, setAddedFilters] =useState([])
    
    // Reference to scroll to results
    const searchResultsRef = useRef(null);

    const filters = [
        'title',
        'ISBN',
        'publisher',
        'publication year',
        'author',
        'department',
        'topic'
    ]
    const filterCondition = [
        'contains',
        'starts with',
        'equals'
    ]
    const resourceType = [
        'any',
        'book',
        'journal',
        'newsletter',
        'thesis'
    ]
    const dispatch = useDispatch();

     // handle changes
     const handleInitialFilter = (e)=>{
        const {name, value} = e.target

        setInitialFilter((prevdata)=>({
            ...prevdata,
            [name]:value
        }))
    }

    const handleAddFilter = ()=>{
        setAddedFilters([...addedFilters,{
                logic:'and',
                filter:'title',
                condition:'contains',
                input:''
            }])
    }

    const handleAddFilterChange = (data,index)=>{
        const updatedAddedFilter = [...addedFilters]
        updatedAddedFilter[index] = data;
        setAddedFilters(updatedAddedFilter);
    }

    const handleRemoveFilter = (indexToRemove)=>{
        console.log('index to remove: ', indexToRemove)
        setAddedFilters(addedFilters.filter((_,index)=>index!==indexToRemove))
    }

    // fetch search
    const handleSearch = ()=>{
        dispatch(setIsSearch(true))
        dispatch(fetchAdvancedSearchResources({initialFilter,addedFilters, selectedType}))
        
        // Scroll to results after a short delay
        setTimeout(() => {
            if (searchResultsRef.current) {
                searchResultsRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 300);
    }

    const handleClearFilters = () => {
        setInitialFilter({
            filter:'title',
            condition:'contains',
            input:''
        })
        setAddedFilters([])
        dispatch(setTypeArray([]));
        dispatch(setDeptArray([]));
        dispatch(setTopicArray([]));
        dispatch(setSearchQuery(''));
        dispatch(setAdvancedSearch([]))
    }

    //enter trigger
    const handleClickEnter = (event) => {
        if (event.key === "Enter"){
            handleSearch();
        }
    }

    console.log(addedFilters)
    return (
        <div>
            <div className='container-fluid advanced-search-box py-5'>
                <div className='container text-end p-0'>
                    <button className='btn btn-dark fw-semibold' onClick={()=>navigate('/search')}>
                        Go to Basic Search
                        <i class="fa-solid fa-chevron-right ms-2"></i>
                    </button>
                </div>
                <div className="container bg-white shadow-sm rounded p-4 advanced-search ">
                    <div className='row search-filters'>
                        <div className="col-9">
                            <h6 className="mb-3 fs-5">Advanced Search</h6>
                            {/* default filter */}
                            <div className='d-flex gap-2 mb-3'>
                                <select 
                                    className='form-select text-capitalize w-50' 
                                    onChange={handleInitialFilter}
                                    name='filter'
                                    value={initialFilter.filter}
                                >
                                    {filters.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                                <select 
                                    className='form-select text-capitalize w-50'
                                    onChange={handleInitialFilter}
                                    name='condition'
                                    value={initialFilter.condition}
                                >
                                    {filterCondition.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                                <input 
                                    type="text" 
                                    className='form-control w-100'
                                    placeholder="Enter search value..."
                                    name='input'
                                    onChange={handleInitialFilter}
                                    onKeyDown={handleClickEnter}
                                    value={initialFilter.input}
                                />
                            </div>
                            {/* added filters */}
                            {addedFilters.length>0&&addedFilters.map((filter,index)=>(
                                <AddedFilter 
                                    key={index}
                                    index={index}
                                    addedFilter={filter} // this is the added filter
                                    filters={filters} //this is the option
                                    filterCondition={filterCondition}
                                    handleAddFilterChange={(data)=>handleAddFilterChange(data,index)}
                                    handleRemoveFilter={()=>handleRemoveFilter(index)}
                                />
                            ))}
                            {/* add filter button */}
                            <button 
                                className='btn mt-2 d-flex align-items-center gap-2 add-filter'
                                onClick={handleAddFilter}
                            >
                                <i className="fa-solid fa-plus"></i>
                                Add a new line
                            </button>
                        </div> 
                        <div className="col">
                            <h6 className="mb-3 fs-5">Limit results by</h6>
                            {/* resource type */}
                            <select 
                                className='form-select text-capitalize w-100 mb-3'
                                onChange={(e)=>setSelectedType(e.target.value)}
                                value={selectedType}
                            >
                                {resourceType.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                        <button 
                            className="btn btn-outline-dark me-2" 
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>
                        <button 
                            className="btn btn-dark" 
                            onClick={handleSearch}   
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results reference for scrolling */}
            <div ref={searchResultsRef}></div>
        </div>
    )
}

export default AdvancedSearch