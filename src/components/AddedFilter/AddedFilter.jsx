import React, { useEffect, useState } from 'react'
import './AddedFilter.css'

const AddedFilter = ({index, addedFilter, filters, filterCondition, handleAddFilterChange, handleRemoveFilter}) => {
    console.log(index)
    const [filter, setFilter] = useState({
        logic:'and',
        filter:'title',
        condition:'contains',
        input:''
    })
    const logical = [
        'and',
        'or',
        'not'
    ]

    useEffect(()=>{
        handleAddFilterChange(filter)
    }, [filter])

    const handleChange = (e)=>{
        const {name, value} = e.target;

        setFilter((prevdata)=>({
            ...prevdata,
            [name]:value
        }))
    }

  return (
    <div className='mt-2 add-filter-box'>
        <div className='d-flex flex-lg-row flex-column gap-2'>
            <select name="logic" id="" className='form-select w-100 w-lg-25 text-capitalize' onChange={handleChange} value={addedFilter.logic}>
                {logical.map(item=>(
                    <option value={item}>{item}</option>
                ))}
            </select>
            <select name="filter" id="" className='form-select w-100 w-lg-50 text-capitalize' onChange={handleChange} value={addedFilter.filter}>
                {filters.map(item=>(
                    <option value={item}>{item}</option>
                ))}
            </select>
            <select name="condition" id="" className='form-select w-100 w-lg-50 text-capitalize' onChange={handleChange} value={addedFilter.condition}>
                {filterCondition.map(item=>(
                    <option value={item}>{item}</option>
                ))}
            </select>
            <input type="text" name='input' className='w-100 ps-2 form-select open-sans' placeholder='Enter search value...' onChange={handleChange} value={addedFilter.input}/>
            <button className="btn bg-danger text-white" onClick={handleRemoveFilter}>
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
  )
}

export default AddedFilter
