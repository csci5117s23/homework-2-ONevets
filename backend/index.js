
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import {object, string, bool} from 'yup'

// test route for https://<PROJECTID>.api.codehooks.io/dev/
const toDoYup = object({
  owner_id: string().required(),
  title: string().required(),
  description: string().required(),
  category: string().required(),
  completed: bool().required()
})

async function getToDoList(req, res){
  const conn = await Datastore.open();
  conn.getMany('toDo').json(res);
}

async function createToDo(req, res){
  const conn = await Datastore.open();
  const doc = conn.insertOne('toDo', req.body);
  res.status(201).json(doc);
}

async function getCompleted(req, res) {
  const conn = await Datastore.open();    
  const query = {"completed": true};
    const options = {
        filter: query,
    }
    conn.getMany('toDo', options).json(res); 
}

async function getCategories(req, res) {
  const conn = await Datastore.open();    
    const options = {
        filter: {"category": req.params.category}
    }
    conn.getMany('toDo', options).json(res); 
}

app.get('/toDo/category/:category', getCategories);

app.get('/toDo/completed', getCompleted);

app.post('/toDo', createToDo);

app.get('/toDo', getToDoList);

// Use Crudlify to create a REST API for any collection
crudlify(app, {toDo: toDoYup})

// bind to serverless runtime
export default app.init();
