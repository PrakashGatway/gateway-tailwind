'use client';

import PageServices from '@/services/PageServices';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function PartnerSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      mobile: '',
      whatsappNo: '',
      age: '',
      city: '',
      occupation: '',
      adress: '',
      howDidyouKnow: '',
      qualifications: '',
      query: '',
    },
  });

  let router = useRouter()

  const handleUpdate2 = async (data) => { // 'data' now contains validated form values
    // Destructure data if needed, or use data directly
    const {
      name, lastName, email, mobile, whatsappNo, age, city,
      occupation, adress, howDidyouKnow, qualifications, query
    } = data;

    try {
      // Make an API call to update the data
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        lastName,
        whatsappNo,
        city,
        age,
        occupation,
        adress, // Keep typo for consistency
        howDidyouKnow,
        qualification: qualifications,
        message: query,
        type: 'partner'
      });



      if (createJob.status === 'success') {
        // Reset the form fields to their default values
        reset();

        const modalEl = document.getElementById("partnerModal");

        // Manually hide the modal
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        // Remove backdrop
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();// ✅ safer method

        router.push('/thank-you');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting partner form:", error);
      alert('An error occurred. Please try again.'); // Provide user feedback
    }
  };


  // Handle form submission
  const onSubmit = async (data) => {
    const {
      name, lastName, email, mobile, whatsappNo, age, city,
      occupation, adress, howDidyouKnow, qualifications, query
    } = data;

    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        lastName,
        whatsappNo,
        city,
        age,
        occupation,
        adress, // Keep typo for consistency
        howDidyouKnow,
        qualification: qualifications,
        message: query,
        type: 'partner'
      });
      

      if (createJob.status === 'success') {
        // Reset the form fields to their default values
           reset();

        const modalEl = document.getElementById("partnerModal");

        // Manually hide the modal
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();// ✅ safer method
        ('/thank-you');
      } else {
        alert('Something went wrong');
      }
      reset();
      const modalEl = document.getElementById('partnerModal');
      if (modalEl) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
      }
    } catch (error) {
      console.error("Error submitting partner form:", error);
      alert('An error occurred. Please try again.'); // Provide user feedback
    }
  };


  return (
    <section className="app-banner-section">

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="partnerModal"
        tabIndex="-1"
        aria-labelledby="partnerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header bg-gray-200">
              <h5 className="modal-title" id="partnerModalLabel">Become A Partner</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body rounded bg-gray-200">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-2">
                  {/* First Name */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('name', { required: 'First Name is required' })}
                      className={`form-control text-sm ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="First Name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block">{errors.name.message}</div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last Name is required' })}
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback d-block">{errors.lastName.message}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email.message}</div>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('mobile', {
                        required: 'Mobile No. is required',
                        pattern: {
                          value: /^\d{10,15}$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                      placeholder="Mobile No."
                    />
                    {errors.mobile && (
                      <div className="invalid-feedback d-block">{errors.mobile.message}</div>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('whatsappNo')}
                      className="form-control"
                      placeholder="WhatsApp No."
                    />
                  </div>

                  {/* Age */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      {...register('age', { min: 0, max: 120 })}
                      className="form-control"
                      placeholder="Age"
                    />
                  </div>

                  {/* City */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <div className="invalid-feedback d-block">{errors.city.message}</div>
                    )}
                  </div>

                  {/* Occupation */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      {...register('occupation', { required: 'Occupation is required' })}
                      className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
                      placeholder="What is your current Occupation?"
                    />
                    {errors.occupation && (
                      <div className="invalid-feedback d-block">{errors.occupation.message}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <textarea
                      {...register('adress', { required: 'Address is required' })}
                      className={`form-control ${errors.adress ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="Your Address"
                    ></textarea>
                    {errors.adress && (
                      <div className="invalid-feedback d-block">{errors.adress.message}</div>
                    )}
                  </div>

                  {/* How Did You Know */}
                  <div className="col-12">
                    <select
                      {...register('howDidyouKnow', {
                        required: 'Please select how you know about us',
                      })}
                      className={`form-control ${errors.howDidyouKnow ? 'is-invalid' : ''}`}
                    >
                      <option value="">How did you come to know about us?</option>
                      <option value="google">Google Ad</option>
                      <option value="facebook">Facebook Ad</option>
                      <option value="email">Email Campaign</option>
                      <option value="sms">SMS Campaign</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="reference">Reference</option>
                      <option value="newspaper">Newspaper</option>
                      <option value="website">Website</option>
                      <option value="call">Call</option>
                      <option value="instagram">Instagram</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.howDidyouKnow && (
                      <div className="invalid-feedback d-block">{errors.howDidyouKnow.message}</div>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div className="col-12">
                    <textarea
                      {...register('qualifications', { required: 'Qualifications are required' })}
                      className={`form-control ${errors.qualifications ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="What are your Educational Qualifications?"
                    ></textarea>
                    {errors.qualifications && (
                      <div className="invalid-feedback d-block">{errors.qualifications.message}</div>
                    )}
                  </div>

                  {/* Introduction */}
                  <div className="col-12">
                    <textarea
                      {...register('query', { required: 'Introduction is required' })}
                      className={`form-control ${errors.query ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="Please provide a brief introduction about yourself"
                    ></textarea>
                    {errors.query && (
                      <div className="invalid-feedback d-block">{errors.query.message}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 text-right">
                  <button type="submit" className="site-btn">
                    SUBMIT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}