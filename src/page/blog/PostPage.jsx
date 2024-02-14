import React, { useEffect, useState } from 'react';
import * as postApi from '../../api/firebase/post';
import RichTextDisplay from '../../components/text/RichTextDisplay';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../../provider/AuthProvider';

const PostPage = () => {
  const { category, id } = useParams();
  const [post, setPost] = useState();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getPost = async () => {
    const p = await postApi.getPostByCategory(id, category);
    setPost(p);
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleEdit = () => {
    navigate(`/${category}/${id}/edit`);
  };


  if (!post) {
    return (
      <h1>Post does not exist!</h1>
    );
  } else {
    return (
      <div>
        {currentUser && <Button onClick={handleEdit}>EDIT</Button>}
        <RichTextDisplay post={post} />
      </div>
    );
  }
};

export default PostPage;
