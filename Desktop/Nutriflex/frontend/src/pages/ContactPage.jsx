import React, { useState } from 'react';
import api from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status,setStatus]=useState(''); const [busy,setBusy]=useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');setBusy(true);
    try { const res=await api.post('/contact/',form);setStatus(res.data.message||'Thanks for reaching out.');setForm({ name: '', email: '', message: '' }); }
    catch(err){setStatus(err.response?.data?.message||'We could not send your message. Please try again.');}
    finally{setBusy(false);}
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-mint rounded-lg shadow">
        <h1 className="text-4xl font-heading text-forest mb-4">Contact Us</h1>
        <p className="text-body text-lg mb-6">
          Email: <a href="mailto:hello@nutriflex.app" className="underline text-gold">hello@nutriflex.app</a><br />
          Phone: 1800-000-4567<br />
          Address: 4th Floor, Green Park Towers, Bengaluru, India.
        </p>
      </section>
      <section className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {status&&<p role="status" className="text-forest">{status}</p>}
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-2 border border-sage rounded bg-cream text-forest placeholder-forest"
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-2 border border-sage rounded bg-cream text-forest placeholder-forest"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
            className="p-2 border border-sage rounded bg-cream text-forest placeholder-forest"
          />
          <button type="submit" disabled={busy} className="px-6 py-2 bg-forest text-cream rounded hover:bg-sage transition disabled:opacity-60">
            {busy?'Sending…':'Send Message'}
          </button>
        </form>
      </section>
    </div>
  );
}
