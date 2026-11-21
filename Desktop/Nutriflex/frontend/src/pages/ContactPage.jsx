import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend – just clear the form
    alert('Message sent (simulated).');
    setForm({ name: '', email: '', message: '' });
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
          <button type="submit" className="px-6 py-2 bg-forest text-cream rounded hover:bg-sage transition">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
