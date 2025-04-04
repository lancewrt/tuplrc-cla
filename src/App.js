import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import SearchPage from './pages/SearchPage/SearchPage'
import ViewResourcePage from './pages/ViewResourcePage/ViewResourcePage'
import TermsConditions from './pages/TermsConditions/TermsConditions'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/about' element={<AboutUsPage/>}/>
          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/view/:id' element={<ViewResourcePage/>}/>
          <Route path='/terms-conditions' element={<TermsConditions/>}/>
        </Routes>
      </BrowserRouter>
      
      
    </div>
  )
}

export default App
