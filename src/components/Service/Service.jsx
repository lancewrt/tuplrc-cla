import React from 'react'
import './Service.css'

const Service = ({title, subtitle, icon}) => {
  return (
    <div className='services-page'>
      <i class={`fa-solid ${icon} fs-1 icon`}></i>
      <p className="m-0 service-title fs-5 fw-semibold mt-2">{title}</p>
      <p className="m-0 service-subtitle fw-semibold">{subtitle}</p>
    </div>
  )
}

export default Service
