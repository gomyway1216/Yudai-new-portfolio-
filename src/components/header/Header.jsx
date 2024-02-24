import React, { useState } from 'react';
import Scrollspy from 'react-scrollspy';
import { Link, useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {
  FiUser,
  FiBriefcase,
  FiFileText,
  FiPhoneOutgoing,
} from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { FaHome, FaBlog } from 'react-icons/fa';
import { MenuItem, Menu } from '@mui/material/';
import { useAuth } from '../../provider/AuthProvider';

const Header = () => {
  const [click, setClick] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = () => setClick(!click);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    setAnchorEl(null);
  };

  return (
    <>
      {/* Header */}
      <div className="mob-header">
        <button className="toggler-menu" onClick={handleClick}>
          <div className={click ? 'active' : ''}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      {/* End Header */}

      {/* nav bar */}
      <header className={click ? 'header-left menu-open' : 'header-left '}>
        <div className="scroll-bar">
          <div className="hl-top">
            <div className="hl-logo">
              <Link to="/">Y</Link>
            </div>
          </div>
          {/* End htl-top */}

          <Scrollspy
            className="nav nav-menu"
            items={['home', 'about', 'resume', 'work', 'blog', 'contactus', 'admin']}
            currentClassName="active"
            offset={-30}
          >
            <li>
              <a
                className="nav-link "
                href="#home"
                data-tip
                data-for="HOME"
                onClick={handleClick}
              >
                <FaHome />
                <ReactTooltip
                  id="HOME"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Home</span>
                </ReactTooltip>
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="#about"
                data-tip
                data-for="ABOUT"
                onClick={handleClick}
              >
                <FiUser />
                <ReactTooltip
                  id="ABOUT"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>About</span>
                </ReactTooltip>
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="#resume"
                data-tip
                data-for="RESUME"
                onClick={handleClick}
              >
                <FiFileText />
                <ReactTooltip
                  id="RESUME"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Resume</span>
                </ReactTooltip>
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="#work"
                data-tip
                data-for="WORK"
                onClick={handleClick}
              >
                <FiBriefcase />
                <ReactTooltip
                  id="WORK"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Work</span>
                </ReactTooltip>
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="#blog"
                data-tip
                data-for="BLOG"
                onClick={handleClick}
              >
                <FaBlog />
                <ReactTooltip
                  id="BLOG"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Blog</span>
                </ReactTooltip>
              </a>
            </li>
            {/* <li>
              <a
                className="nav-link"
                href="#contactus"
                data-tip
                data-for="CONTACT"
                onClick={handleClick}
              >
                <FiPhoneOutgoing />
                <ReactTooltip
                  id="CONTACT"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Contact</span>
                </ReactTooltip>
              </a>
            </li> */}
            {currentUser && <li>
              <a
                className="nav-link"
                data-tip
                data-for="ADMIN"
                onClick={handleMenu}
              >
                <MdAccountCircle />
                <ReactTooltip
                  id="ADMIN"
                  place="right"
                  type="dark"
                  effect="float"
                >
                  <span>Admin</span>
                </ReactTooltip>
              </a>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/admin')}>Admin Page</MenuItem>
                <MenuItem onClick={handleSignOut}>Log out</MenuItem>
              </Menu>
            </li>
            }
          </Scrollspy>
        </div>
      </header>
      {/* End Header */}
    </>
  );
};

export default Header;
