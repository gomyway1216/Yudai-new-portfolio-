import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa';

const SocialShare = [
  // { Social: <FaFacebookF />, link: 'https://www.facebook.com/yaguchiyuudai' },
  { Social: <FaFacebookF />, link: 'https://www.facebook.com/yaguchiyuudai/' },
  // { Social: <FaInstagram />, link: 'https://www.instagram.com/' },
  { Social: <FaLinkedinIn />, link: 'https://www.linkedin.com/in/yudai-yaguchi/' },
  { Social: <FaTwitter />, link: 'https://twitter.com/yudai_engineer/' },
  // { Social: <FaPinterestP />, link: 'https://www.pinterest.com/' },
];


const Social = () => {
  return (
    <div className="nav social-icons justify-content-center">
      {SocialShare.map((val, i) => (
        <a key={i} href={`${val.link}`} rel="noreferrer" target="_blank">
          {val.Social}
        </a>
      ))}
    </div>
  );
};

export default Social;
