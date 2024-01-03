import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { FiLink } from 'react-icons/fi';
import Masonry from 'react-masonry-css';
import PortfolioModal from './PortfolioModal';
// import content from content.json
// import content from './content.json';
import Modal from 'react-modal';
import Contact from '../contact/Contact';
import { addJobsToFirestore, readJobsFromFirestore, 
  addEducationToFirestore, readProjectsFromFirestore, addProjectsToFirestore } 
  from '../../api/firebase/firestoreOperations';

// Use the functions as needed


// Modal.setAppElement('#root');

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};


const tabList = ['All', 'Web App', 'Mobile', 'AI/ML'];

// Modal.setAppElement('#root');

const PortfolioAnimation = () => {
  const [projectsByCategory, setProjectsByCategory] 
    = useState({'All': [], 'Web App': [], 'Mobile': [], 'AI/ML': []});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


  const [isOpen, setIsOpen] = useState(false);

  function toggleModalOne() {
    console.log('toggleModalOne called', isOpen);
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    classifyProjects();
  }, []);

  const handleProjectClick = (project) => {
    console.log('handleProjectClick called');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // addProjectsToFirestore(content.projects)
  //   .then(() => console.log('Projects added successfully!'))
  //   .catch((error) => console.error('Error adding projects:', error));
  

  const classifyProjects = async () => {
    const classified = {All: [], 'Web App': [], Mobile: [], 'AI/ML': []};

    const fetchedProjects = await readProjectsFromFirestore();

    fetchedProjects.forEach(project => {
      // Add to 'All' category
      classified['All'].push(project);
      // Add to other categories based on the project's category
      project.category.forEach(cat => {
        if (classified.hasOwnProperty(cat)) {
          classified[cat].push(project);
        }
      });
    });

    setProjectsByCategory(classified);
  };

  return (
    <>
      <div className="portfolio-filter-01">
        <Tabs>
          <TabList className="filter d-flex flex-wrap justify-content-start">
            {tabList.map((val, i) => (
              <Tab key={i}>{val}</Tab>
            ))}
          </TabList>
          {/* End tablist */}
          {Object.keys(projectsByCategory).map((category, i) => (
            <TabPanel key={i}>
              <div className="row">
                {projectsByCategory[category].map((project, j) => (
                  <div
                    className="col-md-6 m-15px-tb"
                    data-aos="fade-right"
                    data-aos-duration="1200"
                    key={category + ':' + j}
                  >
                    <div className="blog-grid" onClick={() => handleProjectClick(project)}>
                      <div className="blog-img">
                        <img src={project.thumbImage} alt="blog post"></img>
                      </div>
                      <div className="blog-info">
                        <div className="meta">29/FEB/2020 - BY ALEX</div>
                        <h6>
                          <a>
                            {project.title}
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            </TabPanel>
          ))}
          {/* End tabpanel */}
        </Tabs>
      </div>

      {selectedProject && <PortfolioModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        setIsOpen={setIsModalOpen}
      />
      }
    </>

  );
};

export default PortfolioAnimation;
