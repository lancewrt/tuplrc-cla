import React, { useEffect } from 'react'
import { motion } from 'framer-motion'; // Import Framer Motion
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './TermsConditions.css'

const fadeIn = {    
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2} },
};

const TermsConditions = () => {
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
  return (
    <div className='tc-container'>
      <motion.div className='top-welcome p-2 text-center' variants={fadeIn}>
        <p className="m-0">Welcome to College of Liberal Arts' Online Catalog!</p>
      </motion.div>

      <div className='border border-bottom-1'>
        <Navbar/> 
      </div>

      <div className="container">
        <div className="py-5 p-3 d-flex flex-column justify-content-center">
          <h1 className='m-0 fw-bold fs-md-5 open-sans'>Terms and Conditions for the Use of the College of Liberal Arts Learning Resource Center (LRC)</h1>
          <p className='m-0 fs-md-6 open-sans'>Our Terms and Conditions outline the rules, rights, and responsibilities for using our services. By accessing or using our facility, you agree to comply with these terms, including guidelines on acceptable use, user obligations, privacy, intellectual property, and liability limitations. Please read them carefully to ensure you understand your rights and obligations when using our services.</p>
        </div>

        <div className="mb-5">
          <ul className=''>
            {/* article 1 */}
            <li className='fs-4'>Article 1: Name and Nature of the Center</li>
            <ul>
              <li>1.1. The Learning Resource Center (LRC) shall be referred to as the College of Liberal Arts’ Learning Resource Center.</li>
              <li>1.2. The LRC is primarily established to house a variety of academic resources in the field of Liberal Arts, supporting students from all courses, colleges, and departments at the Technological University of the Philippines.</li>
              <li>1.3. The LRC functions as a supporting center to the College of Liberal Arts (CLA), aiding in the realization of its vision and mission.</li>
              <li>1.4. Dedicated areas within the LRC shall cater to the specific needs of various College specializations, including but not limited to:</li>
              <ul>
                <li>•	Entrepreneurship</li>
                <li>•	Social Science</li>
                <li>•	Language</li>
                <li>•	Hotel and Restaurant Management</li>
              </ul>
              <li>1.5. Additional areas shall be allocated for CLA supporting offices:</li>
              <ul>
                <li>•	CLA Research and Extension Office</li>
                <li>•	CLA Outcomes-Based Education (OBE) Coordinator Office</li>
              </ul>
              <li>1.6 As an extension of the College of Liberal Arts, the LRC operates under the authority of the CLA and serves the mandates and requirements set forth by the College.</li>
            </ul>

            {/* article 2 */}
            <li className='fs-4 mt-4'>Article 2: Purposes and Principles</li>
            <ul>
              <li>2.1. The LRC is committed to providing students with a dedicated area for the study and appreciation of Liberal Arts in an institution primarily technological in nature.</li>
              <li>2.2. The key purposes of the LRC are as follows:</li>
              <ul>
                <li>•	Provide a dedicated study space for students focusing on Liberal Arts and its specializations.</li>
                <li>•	Facilitate consultations between students and CLA faculty.</li>
                <li>•	Serve as a meeting venue for student organizations under the CLA.</li>
                <li>•	Provide a planning and meeting space for CLA faculty.</li>
                <li>•	Function as a secondary classroom for CLA faculty when needed.</li>
                <li>•	Act as a thesis consultation and defense room.</li>
                <li>•	Host the offices of the CLA OBE Coordinator and CLA Research and Extension Coordinator along with their respective staff.</li>
              </ul>
              <li>2.3. The LRC complements and supplements the academic resources available in the Technological University of the Philippines Library.</li>
            </ul>

            {/* article 3 */}
            <li className='fs-4 mt-4'>Article 3: Usage Guidelines</li>
            <ul>
              <li>3.1. General Access</li>
              <ul>
                <li>•	The LRC is open to all students enrolled at the Technological University of the Philippines.</li>
                <li>•	CLA faculty members may utilize the LRC for academic research, instruction, and accessing available resources.</li>
              </ul>
              <li>3.2. Proper Conduct</li>
              <ul>
                <li>•	Users are expected to maintain a quiet and respectful environment conducive to study and research.</li>
                <li>•	Resources must be handled with care to ensure their longevity and availability for all users.</li>
              </ul>
              <li>3.3. Resource Utilization</li>
              <ul>
                <li>•	Borrowing and returning of materials shall follow the guidelines set by the LRC.</li>
                <li>•	Some resources may be designated for on-site use only and must not be removed from the premises.</li>
              </ul>
              <li>3.4. Reservation of Facilities</li>
              <ul>
                <li>•	Certain areas of the LRC, such as meeting rooms or consultation spaces, may require prior reservation.</li>
                <li>•	Reservations must be approved by LRC staff to ensure fair access and availability.</li>
              </ul>
              <li>3.5. Restrictions</li>
              <ul>
                <li>•	Misuse or damage of resources and facilities may result in penalties or suspension of access rights.</li>
                <li>•	Unauthorized use of restricted areas or materials is strictly prohibited.</li>
              </ul>
            </ul>


            {/* article 4 */}
            <li className='fs-4 mt-4'>Article 4: Amendments and Final Provisions</li>
            <ul>
              <li>4.1. The Terms and Conditions may be subject to amendments as deemed necessary by the CLA and approved by the appropriate university authorities.</li>
              <li>4.2. All users are required to comply with the policies and guidelines set forth in this document. Non-compliance may result in disciplinary actions as determined by the CLA.</li>
              <li>4.3. The Terms and Conditions shall take effect immediately upon approval by the College of Liberal Arts and the Dean of the Technological University of the Philippines.</li>
            </ul>
          </ul>
        </div>
      </div>


      {/* footer */}
      <Footer/>
    </div>
  )
}

export default TermsConditions
