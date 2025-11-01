'use client'

import { useState } from 'react'

const services = [
  'AI Calling Agent',
  'Game Development',
  'Mobile App Development',
  'Full-Stack Web Development',
  'Cybersecurity Solutions',
  'Robotic Process Automation',
  'Cloud Computing Solutions',
  'Artificial Intelligence & ML Development',
  'Data Analytics & Business Intelligence',
  'Internet of Things (IoT) Development',
  'VR/AR Solutions',
  'Blockchain Development',
  'AI Chatbot Development',
  'UX/UI Design',
  'Business Automation'
]

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    services: [] as string[],
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setResponseMessage('')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setResponseMessage('Thank you! We\'ll contact you shortly.')
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          services: [],
          message: ''
        })
      } else {
        setStatus('error')
        setResponseMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setResponseMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Alfox<span className="text-purple-400">.ai</span>
            </h1>
            <p className="text-xl text-gray-300">
              Innovative Technology Solutions for Your Business
            </p>
          </div>

          {/* Services Grid */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service}
                  className="bg-white/5 backdrop-blur rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    </div>
                    <p className="text-gray-200 text-sm">{service}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Get Started Today</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 mb-2 font-medium">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-2 font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-2 font-medium">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 mb-2 font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-200 mb-3 font-medium">
                  Services of Interest *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label
                      key={service}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-400 focus:ring-2 focus:ring-purple-400"
                      />
                      <span className="ml-3 text-gray-200 group-hover:text-white transition-colors">
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-200 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Tell us about your project..."
                />
              </div>

              {status !== 'idle' && (
                <div
                  className={`p-4 rounded-lg ${
                    status === 'success'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                      : status === 'error'
                      ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                      : 'bg-blue-500/20 border border-blue-500/50 text-blue-200'
                  }`}
                >
                  {status === 'loading' ? 'Submitting...' : responseMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || formData.services.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-400">
            <p>&copy; 2024 Alfox.ai - Innovative Technology Solutions</p>
          </div>
        </div>
      </div>
    </main>
  )
}
