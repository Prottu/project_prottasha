import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';    // Google icon (colored)
import { FaFacebookF } from 'react-icons/fa'; // Facebook icon

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    birthDate: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signed up with email: ${formData.email}`);
  };

  const handleGoogleSignUp = () => {
    alert('Simulated sign up with Google');
  };

  const handleFacebookSignUp = () => {
    alert('Simulated sign up with Facebook');
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <label>Email</label><br/>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', marginBottom: 10 }}
        />
        <label>Password</label><br/>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', marginBottom: 10 }}
        />
        <label>Birth Date</label><br/>
        <input 
          type="date" 
          name="birthDate" 
          value={formData.birthDate} 
          onChange={handleChange} 
          required 
          min="0001-01-01"
          max="9999-12-31"
          style={{ width: '100%', marginBottom: 20 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 20 }}>
          Sign Up
        </button>
      </form>

      {/* Container for buttons side by side, centered and close */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button 
          onClick={handleGoogleSignUp} 
          aria-label="Sign up with Google"
          style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: 6, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <FcGoogle size={18} />
        </button>

        <button 
          onClick={handleFacebookSignUp} 
          aria-label="Sign up with Facebook"
          style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#4267B2', 
            border: 'none', 
            borderRadius: 6, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <FaFacebookF size={18} color="white" />
        </button>
      </div>
    </div>
  );
}

export default SignUp;


