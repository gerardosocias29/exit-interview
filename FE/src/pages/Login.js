import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/login', {
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.isAdmin) {
          window.location.href = '/admin/dashboard/all';
        } else {
          window.location.href = '/forms';
        }
      });
  };

  return (
    <div class="container-fluid">
      <div class="row justify-content-center align-items-center min-vh-100 bg-main-student">
        <div class="col-xs-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
          <div class="card border-0">
            <div class="card-header p-0">
              <img src="/login.jpeg" class="card-img-top" alt="" />
            </div>
            <div class="card-body">
              <form onSubmit={onSubmit}>
                <h5 class="card-title text-center my-2">Login</h5>
                <div class="mb-3">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    class="form-control"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                <div class="mb-3">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                </div>
                <button type="submit" class="btn btn-primary btn-block">
                  Login
                </button>
              </form>
              <hr />
              <div class="text-center">
                <a href="/register">No account yet? Register here</a>
                <br />
                <a href="/privacy-policy">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
