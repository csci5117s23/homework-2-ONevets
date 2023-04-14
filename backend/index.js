/*
 * Auto generated Codehooks (c) example
 * Install: npm i codehooks-js codehooks-crudlify
 */
import { app, Datastore } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import { object, string, bool } from "yup";
import jwtDecode from "jwt-decode";

// test route for https://<PROJECTID>.api.codehooks.io/dev/
const toDoYup = object({
  owner_id: string().required(),
  title: string().required(),
  description: string().required(),
  category: string().required(),
  completed: bool().required(),
});

// This can largely be copy-pasted, it just grabs the authorization token and parses it, stashing it on the request.
const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  }
};

app.use(userAuth);

// some extra logic for GET / and POST / requests.
app.use("/toDo", (req, res, next) => {
  if (req.method === "POST") {
    // always save authenticating user Id token.
    // note -- were not enforcing uniqueness which isn't great.
    // we don't currently have a great way to do this -- one option would be to
    // have a user collection track which collections have been filled
    // It's a limitation for sure, but I'll just make that a front-end problem...
    req.body.userId = req.user_token.sub;
  } else if (req.method === "GET") {
    // on "index" -- always check for authentication.
    req.query.userId = req.user_token.sub;
  }
  next();
});

async function getToDoList(req, res) {
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  const options = {
    filter: { owner_id: userId },
  };
  conn.getMany("toDo", options).json(res);
}

async function createToDo(req, res) {
  const conn = await Datastore.open();
  const doc = conn.insertOne("toDo", req.body);
  res.status(201).json(doc);
}

async function getDone(req, res) {
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  const query = { completed: true, owner_id: userId };
  const options = {
    filter: query,
  };
  conn.getMany("toDo", options).json(res);
}

async function getCategories(req, res) {
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  const options = {
    filter: { category: req.params.category, owner_id: userId },
  };
  conn.getMany("toDo", options).json(res);
}

async function getTask(req, res){
  const id = req.params.id;
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  try{
    const doc = await conn.getOne("toDo", id);
    if(doc.owner_id != userId){
      res.status(403).end();
      return;
    } else{
      res.json(doc);
    }
  } catch(e){
    res.status(404).end(e);
    return;

  }
}

async function editTask(req, res) {
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  if(req.body.owner_id == userId){
    const data = await conn.updateOne('toDo', req.params.id, req.body);
    res.json(data);
    
  } else{
    res.status(403).end();
    return;
  }
  
}

app.get("/toDo/category/:category", getCategories);

app.get("/toDo/:id", getTask);

app.put("/toDo/:id", editTask);

app.get("/done", getDone);

app.post("/toDo", createToDo);

app.get("/toDo", getToDoList);

// Use Crudlify to create a REST API for any collection
crudlify(app, { toDo: toDoYup });

// bind to serverless runtime
export default app.init();
