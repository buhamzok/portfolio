import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! This form is currently in demo mode.');
    setFormData({ name: '', email: '', message: '' });
  };

  const inputClass = (field) =>
    `w-full bg-bg-secondary border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted outline-none transition-all duration-300 ${
      focused[field] ? 'border-accent-primary glow-sm' : 'border-glass-border'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 stagger-child">
      <div>
        <label className="block text-sm text-text-muted mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocused({ ...focused, name: true })}
          onBlur={() => setFocused({ ...focused, name: false })}
          placeholder="Your name"
          className={inputClass('name')}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-text-muted mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocused({ ...focused, email: true })}
          onBlur={() => setFocused({ ...focused, email: false })}
          placeholder="your@email.com"
          className={inputClass('email')}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-text-muted mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => setFocused({ ...focused, message: true })}
          onBlur={() => setFocused({ ...focused, message: false })}
          placeholder="Tell me about your project..."
          rows={5}
          className={`${inputClass('message')} resize-none`}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-orange text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        Send Message
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default ContactForm;
