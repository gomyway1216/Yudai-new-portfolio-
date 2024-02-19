import React, { FC } from 'react';
import * as api from '../../api/firebase/project';
import { useParams } from 'react-router-dom';
import ProjectEditor from '../../components/editProject/ProjectEditor';

const EditProjectPage = () => {
  const { id } = useParams();

  return (
    <ProjectEditor
      projectId={id}
      getProject={api.getProject}
      createProject={api.createProject}
      updateProject={api.updateProject}
      deleteProject={api.deleteProject}
    />
  );
};  

export default EditProjectPage;