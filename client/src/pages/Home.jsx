import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';
import heroImage from '../Assets/img/illustrations/hero.png';
import quoteImage from '../Assets/img/gallery/quote.png';
import avatarImage from '../Assets/img/icons/avatar.png';

import '../App.css'; // Assuming you have global styles in App.css
import '../styles/Home.css'; // Create and use Home.css for component-specific styles

const Home = () => {
  const { user } = useContext(UserContext);

  // Testimonial data
  const testimonials = [
    {
      title: 'Fantastic service!',
      text:
        'I purchased a phone from an e-commerce site, and this courier service provider assisted me in getting it delivered to my home. I received my phone within one day, and I was really satisfied with their service when I received it.',
      name: 'Yaya Tanguy',
      position: 'Chief Executive, DLF',
      avatar: avatarImage,
    },
    {
      title: 'Excellent delivery!',
      text:
        'Their delivery speed is unmatched. I ordered a gift for my friend, and it reached on time without any hassle. I highly recommend their services for anyone looking for reliable courier solutions.',
      name: 'jomon Jou',
      position: 'CEO, ABC Corp',
      avatar: avatarImage,
    },
    {
      title: 'Great experience!',
      text:
        'From placing the order to receiving it, everything was smooth. The courier service provider maintained constant communication and delivered the package securely. I will surely use their services again.',
      name: 'Atlas Doe',
      position: 'Marketing Manager, XYZ Ltd',
      avatar: avatarImage,
    },
    {
      title: 'Superb service!',
      text:
        'This courier service provider is excellent! They handled my fragile items with care and delivered them on time. I appreciate their professionalism and would recommend them to anyone.dhn dhdh dhdfhd dhd dhdfhdfh',
      name: 'John Smith',
      position: 'Operations Manager, ABC Inc',
      avatar: avatarImage,
    }, {
      title: 'Excellent Work!',
      text:
        'This courier service provider is excellent! They handled my fragile items with care and delivered them on time. I appreciate their professionalism and would recommend them to anyone.dhn dhdh dhdfhd dhd dhdfhdfh',
      name: 'Tom Halland',
      position: 'Operations Manager, ABC Inc',
      avatar: avatarImage,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Automatically slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CssBaseline />
      <h1 style={{ fontSize: '4rem', padding:"120px",paddingLeft:"100px",paddingBottom:"0px"}}>
        {user && <span className="title-success">{user}:</span>} Welcome to courierHub{' '}
        <span className="colorText">!</span>
      </h1>
      <div className="containerhome" >
        <div className="content-container" style={{ padding: '70px' ,paddingTop:'10px'}}>
          <span className="trusted-provider">A trusted provider of </span>
          <br />
          <span className="trusted-provider1">courier services.</span>
          <p>
            We deliver your products safely to
            <br />
            your home in a reasonable time.
          </p>
          <Link to="/order" role="button">
            Get started <i className="fas fa-arrow-right" style={{ margin: '1px' }}></i>
          </Link>
        </div>
        <div className="image-container">
          <img src={heroImage} alt="hero-header" />
        </div>
      </div>
      <section className="py-7" >
        <div className="container-fluid">
          <div className="row flex-center position-relative" >
            <div className="quote-icon" style={{ backgroundImage: `url(${quoteImage})` }}></div>
            <div className="col-md-2 col-lg-5 text-center content-container" style={{paddingLeft: '300px'}}>
              <h5 className="text-danger">TESTIMONIAL</h5>
              <span className="fw-bold fs-4" style={{fontSize:"3rem"}}>Our Awesome Clients</span>
            </div>
          </div>
          <div className="row justify-content-between align-items-center" style={{paddingTop:"80px"}}>
            <div className="col-md-1">
              <button
                className="carousel-control-prev"
                type="button"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              </button>
            </div>
            <div className="col-md-10">
              <div className="carousel slide" id="carouselExampleDark" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                      data-bs-interval="10000"
                    >
                      <div className="row justify-content-center">
                        <TestimonialCard
                          title={testimonial.title}
                          text={testimonial.text}
                          name={testimonial.name}
                          position={testimonial.position}
                          avatar={testimonial.avatar}
                          key={index}
                        />
                        {index + 1 < testimonials.length && (
                          <TestimonialCard
                            title={testimonials[index + 1].title}
                            text={testimonials[index + 1].text}
                            name={testimonials[index + 1].name}
                            position={testimonials[index + 1].position}
                            avatar={testimonials[index + 1].avatar}
                            key={index + 1}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-1">
              <button
                className="carousel-control-next"
                type="button"
                onClick={nextSlide}
                aria-label="Next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div>
        <br/>
        <br/>
        <br/>
      </div>
    </>
  );
};

const TestimonialCard = ({ title, text, name, position, avatar }) => (
  <div className="col-md-6 mb-3 mb-md-0">
    <div className="card h-100 card-span p-3">
      <div className="card-body">
        <h5 className="mb-0 text-primary-c1">{title}</h5>
        <p className="card-text pt-3">{text}</p>
        <div className="d-xl-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fas fa-star text-primary-c1 me-1"></i>
            ))}
          </div>
          <div className="d-flex align-items-center">
            <img className="img-fluid" src={avatar} alt="avatar" />
            <div className="flex-1 ms-3">
              <h6 className="mb-0 fs--1 text-1000 fw-medium">{name}</h6>
              <p className="fs--2 fw-normal mb-0">{position}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
