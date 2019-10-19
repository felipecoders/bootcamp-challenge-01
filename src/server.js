import express from 'express';

const app = express();

app.use(express.json());

const projects = [];
let requests = 0;

function checkExistsProject(req, res, next) {
  if (!projects.find(({ id }) => id === Number(req.params.id))) {
    return res.status(400).json({ error: "Project dosen't exists." });
  }

  return next();
}

function countRequests(req, res, next) {
  requests += 1;

  console.log(`Requests count: ${requests}`);

  return next();
}

app.get('/projects', countRequests, (req, res) => {
  return res.json(projects);
});

app.post('/projects', countRequests, (req, res) => {
  const project = { ...req.body, tasks: [] };
  projects.push(project);

  return res.json(project);
});

app.put('/projects/:id', countRequests, checkExistsProject, (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body;

  const currentProject = projects.find(project => project.id === id);

  currentProject.title = title;

  return res.json(currentProject);
});

app.delete('/projects/:id', countRequests, checkExistsProject, (req, res) => {
  const { id } = req.params;
  projects.forEach((project, index, arr) => {
    if (project.id === Number(id)) {
      arr.splice(index, 1);
    }
  });

  res.json();
});

app.post(
  '/projects/:id/tasks',
  countRequests,
  checkExistsProject,
  (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const currentProject = projects.find(project => project.id === Number(id));
    currentProject.tasks.push(task);

    return res.json(currentProject);
  }
);

app.listen(3333);
