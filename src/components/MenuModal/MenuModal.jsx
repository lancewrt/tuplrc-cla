import React from 'react'
import ReactDom from 'react-dom'
import './MenuModal.css'
import { Link } from 'react-router-dom'


const MenuModal = ({openSideMenu, closeSideMenu}) => {

    if(!openSideMenu){
        return null
    }

  return ReactDom.createPortal(
    <div className='modal-container'>
     <div className={openSideMenu?'overlay':''}></div>
      
      {/* menu */}
      <div className='modal-nav-menu-list'>
                <div className='exit-modal'>   
                    <button onClick={closeSideMenu} className='close-modal-button'><i className="fa-solid fa-xmark"></i></button>  
                </div>
                
                <ul>
                    <li><Link className='nav-menu'>
                        Home
                    </Link></li>
                    <li><Link className='nav-menu'>
                        About Us
                    </Link></li>
                    <li><Link className='nav-menu'>
                        Services
                    </Link></li>
                </ul>
      </div>
    </div>,
    document.getElementById('menu-modal')
  )
}

export default MenuModal
