import React, { FC } from 'react';
import * as api from '../../api/firebase/post';
import { useParams } from 'react-router-dom';
import PostEditor from '../../components/edit/PostEditor';

const EditPostPage = () => {
  const { category, id } = useParams();

  return (
    <PostEditor
      category={category}
      postId={id}
      getPost={api.getPostByCategory}
      createPost={api.createPost}
      updatePost={api.updatePost}
      deletePost={api.deletePostByCategory}
    />
  );
};

export default EditPostPage;
