import { useState } from 'react';
import { sendMessage } from '../api/client';

const EMPTY = { name: '', email: '', message: '' };

export default function Contact({ profile }) {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: 'idle', error: null, fields: {} });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setState({ status: 'sending', error: null, fields: {} });
    try {
      await sendMessage(form);
      setForm(EMPTY);
      setState({ status: 'sent', error: null, fields: {} });
    } catch (err) {
      setState({ status: 'idle', error: err.message, fields: err.fields ?? {} });
    }
  }

  return (
    <section id="contact" className="band">
      <div className="eyebrow">03 — Open a connection</div>
      <h2>Let&apos;s talk throughput.</h2>
      <p className="sub">Open to backend, platform and distributed-systems roles. Fastest reply is email.</p>

      <div className="reach">
        <a className="btn" href={`mailto:${profile.email}`}>{profile.email}</a>
        <a className="btn ghost" href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>
        <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>

      <div className="form">
        <label>
          <span>Your name</span>
          <input value={form.name} onChange={set('name')} placeholder="Jordan Reyes" />
          {state.fields.name && <em>{state.fields.name}</em>}
        </label>
        <label>
          <span>Email</span>
          <input value={form.email} onChange={set('email')} placeholder="jordan@company.com" />
          {state.fields.email && <em>{state.fields.email}</em>}
        </label>
        <label className="wide">
          <span>What are you building?</span>
          <textarea rows={4} value={form.message} onChange={set('message')} placeholder="A few lines about the role or the system." />
          {state.fields.message && <em>{state.fields.message}</em>}
        </label>

        <div className="actions">
          <button className="btn" onClick={submit} disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {state.status === 'sent' && <span className="ok">Sent. I&apos;ll reply within a day.</span>}
          {state.error && <span className="bad">{state.error}</span>}
        </div>
      </div>

      <div className="note">
        <span>{profile.location} — open to remote</span>
        <span>Graph served by Spring Boot · rendered with React Three Fiber</span>
      </div>
    </section>
  );
}
