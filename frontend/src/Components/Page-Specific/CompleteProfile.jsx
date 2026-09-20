import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';

export default function CompleteProfile() {

  const [profile, setProfile] = useState({
    full_name: '',
    first_name: "",
    last_name: "",
    phone_number: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "Maharashtra",
    zip_code: "",
    email: ''
  });

  const location = useLocation()
  const email = location.state
  const navigate = useNavigate()

   const notify = (message) => toast.success(message);

  function handleFirstNameChange(e) {
    setProfile({
      ...profile,
      first_name: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setProfile({
      ...profile,
      last_name: e.target.value,
    });
  }

  function handlePhoneNumberChange(e) {
    setProfile({
      ...profile,
      phone_number: e.target.value,
    });
  }

  function handleAddress1Change(e) {
    setProfile({
      ...profile,
      address_1: e.target.value,
    });
  }

  function handleAddress2Change(e) {
    setProfile({
      ...profile,
      address_2: e.target.value,
    });
  }

  function handleCityChange(e) {
    setProfile({
      ...profile,
      city: e.target.value,
    });
  }

  function handleStateChange(e) {
    console.log(e.target.value);
    setProfile({
      ...profile,
      state: e.target.value,
    });
  }

  function handleZipCodeChange(e) {
    setProfile({
      ...profile,
      zip_code: e.target.value,
    });
  }

  async function handleSubmit(e) {
    try {
    e.preventDefault();

    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/complete-profile`,
      {
        full_name: profile.first_name + " " + profile.last_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip_code: profile.zip_code,
        email: email
      }
    );

      if(response.status == 200){
        notify(response.data.message)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="px-5 py-4 rounded-2 shadow">
      <Toaster />
      <h1 className="text-center mb-lg-4">Complete your Profile</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail1"
            name="first_name"
            required
            onChange={handleFirstNameChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            name="last_name"
            required
            onChange={handleLastNameChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="inputEmail2"
            name="phone_number"
            required
            minLength={10}
            maxLength={10}
            onChange={handlePhoneNumberChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Email
          </label>
          <fieldset disabled>
            <input
              type="text"
              id="disabledTextInput"
              className="form-control"
              placeholder={email? email: 'Email'}
            />
          </fieldset>
        </div>
        <div className="col-12">
          <label className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main St"
            name="address_1"
            required
            onChange={handleAddress1Change}
          />
        </div>
        <div className="col-12">
          <label className="form-label">
            Address 2
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress2"
            placeholder="Apartment, studio, or floor"
            name="address_2"
            required
            onChange={handleAddress2Change}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCity"
            name="city"
            required
            onChange={handleCityChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">
            State
          </label>
          <select
            id="inputState"
            className="form-select"
            value={profile.state}
            onChange={handleStateChange}
          >
            <option value="Maharashtra">
              Maharashtra
            </option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">
            Zip
          </label>
          <input
            type="text"
            className="form-control"
            id="inputZip"
            name="zip_code"
            required
            onChange={handleZipCodeChange}
          />
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary w-100 p-2 mt-2 rounded-3"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
