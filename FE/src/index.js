import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Survey } from './pages/Survey';
import { Form } from './pages/Form';
import { AddOrUpdateForm } from './pages/AddOrUpdateForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { SurveyResponses } from './pages/SurveyResponses';
import { SurveyResponseDetail } from './pages/SurveyResponseDetail';
import { SurveyResponseGroupDetail } from './pages/SurveyResponseGroupDetail';
import { Users } from './pages/Users';
import { Course } from './pages/Course';
import { Thanks } from './pages/Thanks';
import { Profile } from './pages/Profile';
import { Download } from './pages/Download';
import { Login } from './pages/Login';
import { Privacy } from './pages/Privacy';
import { Register } from './pages/Register';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin/dashboard/:course' element={<AdminDashboard />} />
        <Route path='/forms' element={<Form />} />
        <Route path='/form/:id/update' element={<AddOrUpdateForm />} />
        <Route path='/form/add' element={<AddOrUpdateForm />} />
        <Route path='/users' element={<Users />} />
        <Route path='/course' element={<Course />} />
        <Route path='/thanks' element={<Thanks />} />

        <Route path='/survey/:course' element={<Survey />} />
        <Route path='/survey/:id/responses' element={<SurveyResponses />} />
        <Route path='/survey/:id/responses/:user_form_id' element={<SurveyResponseDetail />} />
        <Route path='/survey/:id/response' element={<SurveyResponseGroupDetail />} />
        <Route path='/register' element={<Register />} />
        <Route path='/download/:course' element={<Download />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/privacy-policy' element={<Privacy />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
