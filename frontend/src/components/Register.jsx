import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { pageBackground, formCard, formTitle, labelClass, inputClass, submitBtn, loadingClass, errorClass } from '../styles/common'
import api from '../api'

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{errors} } = useForm()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const submitForm = async(newUser)=>{
    setLoading(true)
    setError(null)
    console.log('Submitting user data:', newUser)
      //make API req to user/author registration
      try{
        const { role, profileImageUrl, ...userObj } = newUser
        const formData = new FormData()

        Object.entries(userObj).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value)
          }
        })

        if (profileImageUrl && profileImageUrl[0]) {
          formData.append('profileImageUrl', profileImageUrl[0])
        }
        
      if(newUser.role==="user"){
        let resObj=await api.post("/users/register",formData)
        let res=resObj.data
        console.log('User registration response:', res)
        if(resObj.status===201){
          navigate('/login')
        }
      }
    if(newUser.role==="author"){
      let resObj=await api.post("/authors/register",formData)
        let res=resObj.data
        console.log('Author registration response:', res)
        if(resObj.status===201){
          navigate('/login')
        }

    }}
    catch(err){
      console.error('Registration error:', err)
      setError(err.response?.data || err)
    }
    finally{
      setLoading(false)
    }
    
  }

  if(loading===true){
    return <p className={loadingClass}>Registering...</p>
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center p-4`}>
      <form
        onSubmit={handleSubmit(submitForm)}
        className={formCard}
      >
        <h2 className={formTitle}>Register</h2>

        {error && (
          <div className={errorClass}>
            {error.message || 'Registration failed. Please try again.'}
          </div>
        )}

        <label className={labelClass}>Select Role</label>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 transition hover:border-indigo-400">
            <input type="radio" {...register("role", { required: 'Role is required' })} value="user" className="h-4 w-4 accent-blue-600"/>
            User
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 transition hover:border-indigo-400">
            <input type="radio" {...register("role", { required: 'Role is required' })} value="author" className="h-4 w-4 accent-blue-600"/>
            Author
          </label>
        </div>

        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}

        {/* Responsive Name Fields */}
        <div className="mb-3 flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            placeholder="First name"
            className={inputClass}
            {...register("firstName", {
              required: 'First name is required',
              minLength: { value: 3, message: 'First name must be at least 3 characters' },
            })}
          />

          <input
            type="text"
            placeholder="Last name"
            className={inputClass}
            {...register("lastName", {
              required: 'Last name is required',
              minLength: { value: 3, message: 'Last name must be at least 3 characters' },
            })}
          />
        </div>

        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}

        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className={`${inputClass} mb-3`}
          {...register("email", {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className={`${inputClass} mb-3`}
          {...register("password", {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <input
        type="file"
        accept="image/png, image/jpeg"
        {...register("profileImageUrl")}
        onChange={(e) => {

            //get image file
            const file = e.target.files[0];
            // validation for image format
            if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPG or PNG allowed");
                return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
            }

        }} />

      {preview && (
        <div className="mt-3 flex justify-center">
        <img
          src={preview}
          alt="Preview"
            className="h-24 w-24 rounded-full border border-indigo-300 object-cover"
        />
        </div>
      )}
{/* profileImageUrl */}
          <div className="mt-5 flex justify-center">
          <button
            type="submit"
              className={`${submitBtn} max-w-48`}
          >
            Register
          </button>
        </div>

      </form>

    </div>
  )
}

export default Register