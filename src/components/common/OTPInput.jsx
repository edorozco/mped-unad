import { useRef, useState } from 'react'

const OTPInput = ({ length = 6, onComplete, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtp(newOtp)

    if (onChange) {
      onChange(newOtp.join(''))
    }

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all fields are filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length && i < length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }
    
    setOtp(newOtp)
    if (onChange) {
      onChange(newOtp.join(''))
    }
    
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''))
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 border-gray-soft-200 focus:border-primary-cyan focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-all"
        />
      ))}
    </div>
  )
}

export default OTPInput
