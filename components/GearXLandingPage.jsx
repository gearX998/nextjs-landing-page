"use client";

import { useEffect, useState } from "react";

/**
 * GearX.ai Landing Page — refined gallery styling to match design mock.
 */


function validateName(name) {
  const trimmed = name.trim();
  const lettersOnly = /^[A-Za-z ]+$/;

  if (!trimmed.length) return "Name is required"

  if (trimmed.length < 2 || !lettersOnly.test(trimmed)) {
    return "Enter a valid name";
  }

  return false; // no error
}

function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">
      {message}
    </div>
  );
}

const init = { name: "", email: "", phoneNumber: "" }

export default function GearXLandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState(init);
  const [blur, setBlur] = useState([]);
  const [showToast, setShowToast] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      setForm({ ...form, [name]: digitsOnly });
    } else if (name == "name") {

      setForm({ ...form, [name]: value.replace(/[^A-Za-z ]/g, "") });

    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const { phoneNumber, email, name } = form
  const errors = {}

  const isInvalidName = validateName(name)
  if (isInvalidName) {
    errors.name = isInvalidName
  }


  const pLen = phoneNumber.length
  const phoneErr = !pLen ? "Mobile number is required" : pLen != 10 && "Mobile number must be 10 digits"
  if (phoneErr) {
    errors.phoneNumber = phoneErr
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  if (!email) {
    errors.email = "Email is required"
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email"
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
      const endpoint = `https://api.gearx.ai`;

      const newName = form.name.trim()
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { ...form, name: newName }
        })
      });
      if (!res.ok) throw new Error("Network error");
      const data = await res.json()
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      setIsSubmitted(true);
      setShowToast(true)
      setForm(init)
      setTouched(false)
      setBlur([])
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


      {showToast && (
        <Toast
          message="Thank you for submitting!"
          onClose={() => {
            setShowToast(false)
          }}
        />)}

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
            Sign Up for Early Access Now!
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
        <div className="container mx-auto px-6 max-w-4xl">
          <h3 className="text-center text-3xl font-semibold mb-12">Sign Up for Early Access Now!</h3>
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
                { id: "phoneNumber", type: "text", label: "Phone", placeholder: "Enter Your Mobile Number" },
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
                    onBlur={() => setBlur([...blur, id])}
                    // required
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-neutral-300 p-4 "
                  />
                  {(blur.includes(id) || touched) && <div className="text-red-500">{errors[id]}</div>}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-[#FF2056] hover:bg-[#e6194c] disabled:cursor-not-allowed disabled:bg-gray-400 px-12 py-6 rounded-3xl text-lg lg:text-xl font-medium shadow-lg w-full sm:w-auto"
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
