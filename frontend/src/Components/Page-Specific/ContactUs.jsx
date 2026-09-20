import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios'

export default function ContactUs() {

    const [ContactForm, setContactForm] = useState({
      name: '',
      email: '',
      phone_number: '',
      subject: '',
      message: ''
    })

    const success = (message) => toast.success(message);

    function handleNameChange(e){
      setContactForm({
        ...ContactForm,
        name: e.target.value
      })
    }

    function handleEmailChange(e){
      setContactForm({
        ...ContactForm,
        email: e.target.value
      })
    }

    function handlePhoneNumberChange(e){
      setContactForm({
        ...ContactForm,
        phone_number: e.target.value
      })
    }

    function handleSubjectChange(e){
      setContactForm({
        ...ContactForm,
        subject: e.target.value
      })
    }

    function handleMessageChange(e){
      setContactForm({
        ...ContactForm,
        message: e.target.value
      })
    }

    async function handleSubmitContactForm(e){
      e.preventDefault()
      
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contact-us`,{
        name: ContactForm.name,
        email: ContactForm.email,
        phone_number: ContactForm.phone_number,
        subject: ContactForm.subject,
        message:  ContactForm.message
      })

      if(response.status == 200){
        success(response.data.message)
      }
    }

  return (
    <div className="px-lg-5 py-4 mx-5">
      <Toaster />
      <div>
        <h1 className="text-center my-3">Contact Us</h1>
      </div>
      <div>
        <p className="text-center">
          We'd love to hear from you! Please fill out the form below or reach us
          via the contact info.
        </p>
      </div>

      <div className="row">
        <div className="col-lg-6">
          {/* <div className="col-md-7 col-lg-8"> */}
          <form className="needs-validation" onSubmit={handleSubmitContactForm}>
            {" "}
            <div className="row g-3">
              {" "}
              <div className="col-sm-6 w-100">
                {" "}
                <label className="form-label fw-semibold fs-6">
                  Your Name *
                </label>{" "}
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Enter your name"
                  required
                  onChange={handleNameChange}
                />{" "}
                <div className="invalid-feedback">
                  Valid name is required.
                </div>{" "}
              </div>{" "}
              <div className="col-12">
                {" "}
                <label className="form-label fw-semibold fs-6">
                  Email Address *
                </label>{" "}
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                  onChange={handleEmailChange}
                  required
                />{" "}
                <div className="invalid-feedback">
                  Please enter a valid email address.
                </div>{" "}
              </div>{" "}
              <div className="col-12">
                {" "}
                <label className="form-label fw-semibold fs-6">
                  Phone Number{" "}
                  <span className="text-body-secondary">(Optional)</span>
                </label>{" "}
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="+91 983443 57843"
                  onChange={handlePhoneNumberChange}
                />{" "}
              </div>{" "}
              <div className="col-md-5 w-100 mb-3">
                {" "}
                <label className="form-label fw-semibold fs-6">
                  Subject *
                </label>{" "}
                <select className="form-select " id="country" required onChange={handleSubjectChange}>
                  {" "}
                  <option value="-- Select a reason">-- Select a reason --</option>{" "}
                  <option value='Order Inquiry'>Order Inquiry</option>
                  <option value='Return or Refund'>Return or Refund</option>
                  <option value='Account Support'>Account Support</option>
                  <option value='Feedback'>Feedback</option>
                  <option value='Other'>Other</option>{" "}
                </select>{" "}
                <div className="invalid-feedback">
                  Please select a valid country.
                </div>{" "}
              </div>{" "}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold fs-6"
                >
                  Message *
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Write your message..."
                  style={{ height: "150px", resize: "none" }}
                  required
                  onChange={handleMessageChange}
                ></textarea>
              </div>
            </div>{" "}
            <button className="w-100 btn btn-primary btn-lg" type="submit">
              Send Message
            </button>{" "}
          </form>{" "}
          {/* </div> */}
        </div>


        <div className="col-lg-6 gap-2 pt-4">
          <div className="row fw-bold">
            <div>
              <h4 className="fw-bolder">Get in Touch</h4>
            </div>

            <div className="row">
              <h6 className="fw-bolder" style={{ color: "#555555" }}>
                Address:
              </h6>
              <br></br>
              <p className="fw-normal" style={{ color: "#212529bf" }}>
                My Divya Collection, 123 Fashion Street, Mumbai, MH - 400001
              </p>
            </div>

            <div className="row">
              <h6 className="fw-bolder" style={{ color: "#555555" }}>
                Email:
              </h6>
              <br></br>
              <p className="fw-normal" style={{ color: "#212529bf" }}>
                support@mydivyacollection.com
              </p>
            </div>

            <div className="row">
              <h6 className="fw-bolder" style={{ color: "#555555" }}>
                Phone:
              </h6>
              <br></br>
              <p className="fw-normal" style={{ color: "#212529bf" }}>
                +91 0000000000
              </p>
            </div>

        <div className="row mt-2 mb-5">
            <div>
              <h4 className="fs-3 fw-semibold mb-2">Follow Us</h4>{" "}
            </div>
            <div className="col gap-5">
              {/* <Link>
                <InstagramIcon />
              </Link>
              <Link>
                <FacebookIcon />
              </Link> */}

              <Link><img src={`/Social Media Icons/facebook_icon.svg`} alt="" width={30} height={30} className="me-3"/></Link>
              <Link><img src={`/Social Media Icons/instagram_icon.svg`} alt="" width={30} height={30}/></Link>
            </div>
            </div>

            {/* <div className="col"><Link><FacebookIcon /></Link></div> */}

            <div>
              <h4 className="fs-3 fw-semibold">Business Hours</h4>{" "}
            </div>
            <div className="row">
              <p className="fw-normal">Mon-Sat: 10:00AM to 8:00PM <br></br> Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="col-lg-12 mt-5">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.3301874296394!2d72.81289247176791!3d18.916773617757766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d192bdadc1ef%3A0x159f1321cd7bd300!2sDivya%20Collection!5e0!3m2!1sen!2sin!4v1746702289455!5m2!1sen!2sin" className="w-100 rounded-3" height="450" style={{border:'0'}} allowFullScreen="" loading="lazy"></iframe>
        </div>

      </div>
    </div>
  );
}
