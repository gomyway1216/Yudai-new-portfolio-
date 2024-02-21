import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Slider from 'react-slick';
import { useAuth } from '../../provider/AuthProvider';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as util from '../../util/util';
import DOMPurify from 'dompurify';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Modal.setAppElement('#root');

const PortfolioModal = ({ project, isOpen, setIsOpen }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const sliderRef = useRef();

  const purifiedDescription = DOMPurify.sanitize(project.description, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
  });

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
      <KeyboardArrowLeftIcon sx={{ display: 'flex', margin: 'auto' }}/>
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
      <KeyboardArrowRightIcon sx={{ display: 'flex', margin: 'auto' }}/>
    </button>
  );

  SlickArrowRight.propTypes = {
    currentSlide: PropTypes.number.isRequired,
    slideCount: PropTypes.number.isRequired,
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
                    <h4 className="text-4 fw-600">Project Details:</h4>
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
                        {project.technologies.map((tech, index) => {
                          const badgeColor = tech.type === 'language' ? 'bg-primary'
                            : tech.type === 'framework' ? 'bg-secondary' : 'bg-success';
                          return (
                            <span key={index} className={`badge ${badgeColor} me-1 technology`}>
                              {tech.name}
                            </span>
                          );
                        })}
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
                        {util.formatDate(project.date)}
                      </li>
                      <li>
                        <span className={'text-dark fw-600 me-2'}>
                              URL:
                        </span>
                        {project.urls.map((url, index) => {
                          const badgeColor = url.type === 'GitHub' ? 'badge-github'
                            : url.type === 'Website' ? 'badge-website' : 'badge-secondary';
                          return (
                            <a
                              href={url.link}
                              className={`btn ${badgeColor} shadow-none rounded-0 px-2 py-0 url-button`}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={index}
                            >
                              {url.name}
                              {/* <i className="fas fa-external-link-alt ms-1" /> */}
                            </a>
                          );})}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <article className="article">
                <div className="article-content">
                  <div dangerouslySetInnerHTML={{ __html: purifiedDescription }} />
                </div>
              </article>
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