import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import FacultyDashboard from './pages/FacultyDashboard.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import FacultyProfilePage from './pages/FacultyProfilePage.jsx'
import ManageDataPage from './pages/ManageDataPage.jsx'
import StudentProfilePage from './pages/StudentProfilePage.jsx'
import StudentDetailPage from './pages/StudentDetailPage.jsx'
import ManageStudentPage from './pages/ManageStudentPage.jsx'
import RecordEntryPage from './pages/RecordEntryPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element = {<LoginPage/>} />
        <Route path='/signup' element = {<SignupPage/>} />

        <Route path='/student/dashboard' element = {<StudentDashboard/>} />
        <Route path='/student/profile' element = {<StudentProfilePage/>} />
        
        <Route path='/faculty/dashboard' element = {<FacultyDashboard/>} />
        <Route path='/faculty/student/:studentId' element = {<StudentDetailPage/>} />
        <Route path='/faculty/profile' element = {<FacultyProfilePage/>} />
        <Route path='/admin/manage-students' element = {<ManageStudentPage/>} />
        <Route path='/admin/manage-data' element = {<ManageDataPage/>} />
        <Route path='/admin/record-entry' element = {<RecordEntryPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
