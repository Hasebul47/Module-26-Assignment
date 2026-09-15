import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { contactAPI } from '../services/api';

const faqs = [
  {
    q: 'How can I pitch an investigative story to Chronicle?',
    a: 'Registered journalists and contributors can compose and submit drafts directly through the Editorial Studio in their Dashboard. For confidential leaks or whistleblower dispatches, contact our encrypted tips desk directly.',
  },
  {
    q: 'What is the Chronicle Fact-Checking Policy?',
    a: 'Every dispatch published on our portal requires primary source verification, cross-examination by independent senior bureau editors, and real-time compliance with international journalistic ethics codes.',
  },
  {
    q: 'Can I syndicate or republish Chronicle reporting?',
    a: 'Selected non-commercial syndication is allowed with explicit attribution and a canonical link to the original Chronicle report. For commercial syndication licenses, please reach out via the form below.',
  },
  {
    q: 'How do I report a correction or typo in a published dispatch?',
    a: 'Please submit the correction form specifying the exact URL, the passage in question, and verified corroborating sources. Our ombudsman bureau reviews all reports within 24 hours.',
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setSubmitting(true);
      const res = await contactAPI.submit(formData);
      setSuccessMessage(
        res.data.message || 'Thank you for reaching out! Our editorial team will review your inquiry.'
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Unable to submit your message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Editorial Bureau Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight">
            Connect With Our Newsroom
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have a news tip, partnership request, or syndication inquiry? Our global desk is here to listen and respond.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information & Bureau Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-rose-600/20 rounded-full blur-2xl"></div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  Global Headquarters
                </span>
                <h3 className="text-2xl font-bold font-display mt-1">Chronicle Media Bureau</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Independent reporting bureaus in London, New York, and Singapore.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">International Office</strong>
                    <span className="text-slate-300">
                      450 Lexingford Avenue, Suite 1800, New York, NY 10017
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">Newsroom Phone</strong>
                    <span className="text-slate-300">+1 (800) 555-0199 / Direct News Desk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">Editorial Desk Email</strong>
                    <span className="text-slate-300">desk@chronicle-global.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white text-sm">Operating Hours</strong>
                    <span className="text-slate-300">
                      24/7 Continuous Global Wire Dispatch Monitoring
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 font-display mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-600" />
                Encrypted Whistleblower Tips
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For confidential leaks and investigative materials, send encrypted PGP communications or use our secure drop. We guarantee source anonymity.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 font-display mb-1">
                Transmit a Message to the Bureau
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All inquiries are processed by senior staff writers within 24 business hours.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-medium animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Maria Gonzalez"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="maria@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subject / Department *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Syndication Inquiry / Correction / Story Pitch"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    placeholder="Provide detailed information regarding your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition duration-200 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Section */}
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>Reader Knowledge Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-rose-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
