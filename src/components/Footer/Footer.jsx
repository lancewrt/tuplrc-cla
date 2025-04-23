import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=''>
      <div className='container h-100'>
        <div className="row py-5 px-0 px-3">
        {/* logo, subtitle, social */}
        <div className='col-12 col-lg-6 mb-3 mb-lg-0'>
          <div className='text-light row'>
              <p className='m-0 logo fs-1 col-12 head'>Liberal<span>Search</span>.</p>
              <p className='m-0 fs-6 sub col-12 col-lg-8'>An online catalog dedicated for College of Liberal Arts’ Learning Resources Center</p>
              <Link to='https://www.facebook.com/CLATUPManila?rdid=UPcjPFHwN4M2BRlC&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BtpcdvSpg%2F#'>
                <i class="fa-brands fa-facebook fs-1 mt-2 col-12 text-white"></i>
              </Link>
              
          </div>
        </div>

        {/* quick links and contact us */}
        <div className='col'>
          <div className='row'>
            {/* quick links */}
            <div className="quick-links text-light col-12 col-md">
                <h2 className='fs-1 mb-3 head'>Quick Links</h2>
                <ul className='list-unstyled d-flex flex-column gap-2'>
                    <li><Link to='/' className='text-decoration-none text-light'>Home</Link></li>
                    <li><Link to='/about' className='text-decoration-none text-light'>About Us</Link></li>
                    <li><Link to='/terms-conditions' className='text-decoration-none text-light'>Terms & Conditions</Link></li>
                </ul>
            </div>
            {/* contact us */}
            <div className="contact-us text-light col">
                <h2 className='fs-1 mb-3 head'>Contact Us</h2>
                <div className='d-flex align-items-center gap-2'>
                    <i class="fa-solid fa-envelope"></i>
                    <p className="m-0">learningresourcescenter@gmail.com</p>
                </div>
            </div>
          </div>
            
        </div>
      </div>
      </div>
      
      {/* copyright */}
      <div className="copyright text-center">
        <p className="m-0 p-3 text-light fs-lg-6 small-font">Copyright © 2025. All Rights Reserved TUP-CLA Learning Resource Center</p>
      </div>
    </footer>
  );
};

export default Footer;
