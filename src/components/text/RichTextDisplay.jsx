import React, { useEffect, useState, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop, Button, CircularProgress } from '@mui/material';
import DOMPurify from 'dompurify';
import * as util from '../../util/util';
import styles from './rich-text-display.module.scss';
import PropTypes from 'prop-types';

const RichTextDisplay = ({ post }) => {
  const { id, title, body, created, lastUpdated, category, image } = post;

  const purifiedBody = DOMPurify.sanitize(body, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
  });

  // console.log('body: ', body)
  // console.log('purifiedBody: ', purifiedBody)

  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <div className={styles.category}>{category}</div>
      <img src={image} alt="Post image" />
      <div className={styles.date}>{util.formatDate(created)}</div>
      <div className={styles.body}
        dangerouslySetInnerHTML={{ __html: purifiedBody }} />
    </div>
  );
};

RichTextDisplay.propTypes = {
  post: PropTypes.object.isRequired,
};

export default RichTextDisplay;
