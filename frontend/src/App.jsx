
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import LoginPage from './MyComponents/Login'
import SignupPage from './MyComponents/Register'
import UserPosts from './MyComponents/UserPosts'


export default function App() {
  return (
   
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/posts/:id" element={<UserPosts />} />
        </Routes>
      </div>
  )
}
