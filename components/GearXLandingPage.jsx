"use client";

import { useState } from "react";

/**
 * GearX.ai Landing Page — refined gallery styling to match design mock.
 */

export default function GearXLandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const { phoneNumber } = form
  const pLen = phoneNumber.length
  const phoneErr = !pLen ? "mobile number is required" : pLen != 10 && "mobile number must be 10 digits"
  const errors = {}

  if (phoneErr) {
    errors.phoneNumber = phoneErr
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true)
    if (Object.keys(errors).length) return
    setIsSubmitting(true);

    const query = `mutation CreateUserInquirie($name: String, $email: String, $phoneNumber: String) {
  createUserInquirie(name: $name, email: $email, phoneNumber: $phoneNumber) {
    message
  }
}`

    try {
      // Using FormSubmit.co endpoint: configure your email in .env.local
      const email = "gear.guru.cw@gmail.com";
      if (!email) throw new Error("Missing FormSubmit email. Set NEXT_PUBLIC_FORMSUBMIT_EMAIL in .env.local");
      const endpoint = `https://dev.api.gearx.ai`;
      // Post form data as JSON
      const phoneNumber = form.phoneNumber.trim().slice(-10)
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { ...form, phoneNumber }
        }),
      });
      if (!res.ok) throw new Error("Network error");
      const data = await res.json()
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      setIsSubmitted(true);
      alert("thank you for submiting...")
      location.reload()
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const galleryImgs = [
    "/assets/gallery-01.jpg",
    "/assets/gallery-02.jpg",
    "/assets/gallery-03.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#F5F7D8] text-neutral-800 font-sans">
      {/* ─────────────────── TOP BAR ─────────────────── */}
      <header className="w-full bg-[#082660] py-4 px-6">
        <img src="/assets/gearx-logo.png" alt="GearX" className="h-10 w-auto" />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto grid lg:grid-cols-2 items-center gap-16 py-24 px-6">
        <div className="flex flex-col items-center space-y-6">
          <img src="/assets/gearx-logo.png" alt="GearX" className="h-48 w-auto" />
          <p className="text-3xl lg:text-4xl font-semibold text-center lg:text-left">
            GearX – Find Your Sound, Before Anyone Else
          </p>
          <p className="text-base lg:text-lg text-center lg:text-left max-w-lg">
            We’re building India’s smartest destination for musical instruments — powered by AI and tuned to your style.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
            className="text-lg lg:text-xl font-medium px-12 py-6 rounded-3xl bg-[#FF2056] hover:bg-[#e6194c] shadow-lg transition-transform hover:scale-105 w-full sm:w-auto"
          >
            Be First in Line!
          </button>
        </div>
        <div className="w-full max-w-xl mx-auto">
          <img
            src="/assets/hero-gear.jpg"
            alt="Guitar and amp on stage"
            className="w-full h-auto object-cover rounded-[3rem] lg:rounded-r-[8rem] lg:rounded-bl-[8rem] shadow-2xl"
          />
        </div>
      </section>

      {/* Sign-up (Native Form) */}
      <section id="signup" className="bg-white py-24 border-t border-neutral-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <h3 className="text-center text-3xl font-semibold mb-6">Be First in Line!</h3>
          <p className="text-center text-lg text-neutral-600 mb-12 max-w-xl mx-auto">
            Sign up for early access, exclusive perks, and gear drops.
          </p>
          <form
            onSubmit={handleSubmit}
            className="grid gap-6"
          >

            {/* Honeypot field to deter spam */}
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <input type="hidden" name="_captcha" value="false" />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { id: "name", type: "text", label: "Name", placeholder: "Enter Your Full Name" },
                { id: "email", type: "email", label: "Email", placeholder: "Enter Your Email Address" },
                { id: "phoneNumber", type: "number", label: "Phone", placeholder: "Enter Your Mobile Number" },
              ].map(({ id, type, label, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block mb-2 font-medium">
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={form[id]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-neutral-300 p-4 focus:ring-2 focus:ring-[#082660]"
                  />
                  {touched && <div className="text-red-500">{errors[id]}</div>}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#FF2056] hover:bg-[#e6194c] px-12 py-6 rounded-3xl text-lg lg:text-xl font-medium shadow-lg w-full sm:w-auto"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="bg-[#F5F7D8] py-16 border-t border-neutral-200 text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10 px-6">
          <div className="max-w-md space-y-6">
            <h4 className="font-semibold text-lg">GearX.ai</h4>
            <p>
              We're building a new kind of e-commerce experience, powered by AI, for musicians who demand more from their gear hunt. Whether you're jamming in your bedroom or headlining your next gig, GearX helps you find, compare, and choose musical instruments effortlessly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
