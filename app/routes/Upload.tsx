import React from 'react'
import Navbar from '../components/Navbar'
import {useState} from 'react'

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(true)
    const [statusText, setStatusText] = useState('')

  return (
     <main className="bg-[url('/assets/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
            <h1>Smart feeback for your dream job</h1>
            {isProcessing ? (
                <>
                    <h2>{statusText}</h2>
                    <img src="/assets/images/resume-scan.gif" alt="resume scanning" className="w-full" />
                </>
            ) : (
                <h2>Drop your resume for an ATS score and improvement tips</h2>
            )}
        </div>
      </section>
      </main>
  )
}

export default Upload