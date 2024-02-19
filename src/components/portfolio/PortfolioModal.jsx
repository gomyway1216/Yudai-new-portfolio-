import React, { useEffect, useState, useRef } from 'react';
// add prop-types
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Contact from '../contact/Contact';
import Slider from 'react-slick';
import { useAuth } from '../../provider/AuthProvider';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Modal.setAppElement('#root');

const PortfolioModal = ({ project, isOpen, setIsOpen }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const sliderRef = useRef();

  const types = {
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <i className="fa fa-chevron-left"></i>
    </button>
  );

  SlickArrowLeft.propTypes = {
    currentSlide: PropTypes.number.isRequired,
    slideCount: PropTypes.number.isRequired,
  };


  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        'slick-next slick-arrow' +
        (currentSlide === slideCount - 1 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <i className="fa fa-chevron-right"></i>
    </button>
  );

  SlickArrowRight.propTypes = {
    currentSlide: PropTypes.number.isRequired,
    slideCount: PropTypes.number.isRequired,
    // If you have other props, you should validate them here as well
  };

  var settings = {
    dots: true,
    arrows: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    infinite: true,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 450000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [project]);
  
  const handleEdit = () => {
    navigate(`/project/${project.id}/edit`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Project Details Modal"
      className="custom-modal"
      overlayClassName="custom-overlay"
      closeTimeoutMS={500}
    >
      <div>
        {currentUser && <Button onClick={handleEdit}>EDIT</Button>}
        <button className="close-modal" onClick={closeModal}>
          <img src="/img/cancel.svg" alt="close icon" />
        </button>
        {/* End close icon */}

        <div className="box_inner">
          <div className="scrollable">
            <div className="blog-grid">
              <div className={'container ajax-container '}>
                {/* <div className="blog-img">
                  <img src="img/blog/blog-4.jpg" alt="blog post"></img>
                </div> */}
                <h2 className={'text-6 fw-600 text-center mb-4'}>
                  {project.title}
                </h2>
                <div className="row g-4">
                  <div className="col-md-7">
                    <Slider {...settings} ref={sliderRef}>
                      <div className="item">
                        <img
                          className="img-fluid"
                          alt=""
                          src={project?.thumbImage}
                        />
                      </div>
                      {project?.images?.length > 0 &&
                            project?.images?.map(
                              (image, index) => (
                                <div className="item" key={index}>
                                  <img
                                    className="img-fluid"
                                    alt=""
                                    src={image}
                                  />
                                </div>
                              )
                            )}
                    </Slider>
                  </div>
                  <div className="col-md-5">
                    {/* <h4 className="text-4 fw-600">Project Info:</h4>
                    <p>{project.description}</p> */}
                    <h4 className="text-4 fw-600 mt-4">Project Details:</h4>
                    <ul className="list-style-2">
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              Client:
                        </span>
                        {project?.client}
                      </li>
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              Technologies:
                        </span>
                        {project.technologies}
                      </li>
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              Industry:
                        </span>
                        {project.industry}
                      </li>
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              Date:
                        </span>
                        {project.date}
                      </li>
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              URL:
                        </span>
                        <a
                          href={project.urls[0].link}
                          className="btn btn-primary shadow-none rounded-0 px-3 py-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.urls[0].name}
                          <i className="fas fa-external-link-alt ms-1" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* End blog-img */}
              <article className="article">
                
                {/* End .article-title */}

                <div className="article-content">
                  {project.description}
                </div>
                {/* End article content */}
                {/* <ul className="nav tag-cloud">
                  <li href="#">Design</li>
                  <li href="#">Development</li>
                  <li href="#">Travel</li>
                  <li href="#">Web Design</li>
                  <li href="#">Marketing</li>
                  <li href="#">Research</li>
                  <li href="#">Managment</li>
                </ul> */}
                {/* End tag */}
              </article>
              {/* End Article */}

              <div className="contact-form article-comment">
                <h4>Leave a Reply</h4>
                <Contact />
              </div>
              {/* End .contact Form */}
            </div>
          </div>
        </div>
      </div>
      {/* End .container */}
    </Modal>
  );
};

PortfolioModal.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    industry: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    urls: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbImage: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default PortfolioModal;