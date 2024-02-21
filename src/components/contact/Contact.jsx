import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as contactApi from '../../api/firebase/contact';
import { PropTypes } from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Contact = ({ blogId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [messageOpen, setMessgeOpen] = useState(false); 

  const onSubmit = async (data) => {
    try {
      await contactApi.createContact({
        blogId: blogId,
        name: data.name,
        email: data.email,
        subject: data.subject,
        comment: data.comment,
        // Add any additional fields you need
      });
      console.log('Message submitted: ' + JSON.stringify(data));
      reset(); // reset the form only on successful submission
      setMessgeOpen(true);
    } catch (error) {
      console.error('Error submitting message: ', error);
    }
  };

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessgeOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control theme-light"
                placeholder="Full name"
                {...register('name', { required: true })}
              />
              {errors.name && errors.name.type === 'required' && (
                <span className="invalid-feedback">Name is required</span>
              )}
            </div>
          </div>
          {/* End .col-6 */}

          <div className="col-md-6">
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control theme-light"
                placeholder="Email address"
                {...register(
                  'email',
                  {
                    required: 'Email is Required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Entered value does not match email format',
                    },
                  },
                  { required: true }
                )}
              />
              {errors.email && (
                <span className="invalid-feedback">{errors.email.message}</span>
              )}
            </div>
          </div>
          {/* End .col-6 */}

          <div className="col-12">
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control theme-light"
                placeholder="Subject"
                {...register('subject', { required: true })}
              />
              {errors.subject && (
                <span className="invalid-feedback">Subject is required.</span>
              )}
            </div>
          </div>
          {/* End .col-12 */}

          <div className="col-12">
            <div className="form-group mb-3">
              <textarea
                rows="4"
                className="form-control theme-light"
                placeholder="Type comment"
                {...register('comment', { required: true })}
              ></textarea>
              {errors.comment && (
                <span className="invalid-feedback">Comment is required.</span>
              )}
            </div>
          </div>
          {/* End .col-12 */}

          <div className="col-12">
            <div className="btn-bar">
              <button className="px-btn px-btn-white">Send Message</button>
            </div>
          </div>
          {/* End .col-12 */}
        </div>
      </form>
      <Snackbar open={messageOpen} autoHideDuration={6000} onClose={handleMessageClose}>
        <Alert onClose={handleMessageClose} severity="success" sx={{ width: '100%' }}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

Contact.propTypes = {
  blogId: PropTypes.string,
};

export default Contact;
