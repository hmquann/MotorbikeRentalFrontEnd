import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const containerClasses =
  'flex flex-col items-center justify-center h-screen bg-zinc-100 dark:bg-zinc-800'
const textClasses = 'text-zinc-600 dark:text-zinc-400'
const primaryTextClasses = 'text-2xl font-bold text-zinc-800 dark:text-white'
const buttonClasses =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'

const EmailVerify = ({formData}) => {
  return (
    <div className={containerClasses}>
      <img className="h-24 w-auto mb-8" src="https://placehold.co/150" alt="Email Confirmation" />
      <h2 className={primaryTextClasses}>Confirm Your Email</h2>
      <p className={`${textClasses} text-center mb-6`}>
        An email will send to your inbox. Please click "Send Email" to receive confirmation email.
      </p>
      <button type="submit" className={buttonClasses}>Send Email</button>
    </div>
  )
}

export default EmailVerify
