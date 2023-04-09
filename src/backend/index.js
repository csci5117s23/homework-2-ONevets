
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import {object, string} from 'yup'

// test route for https://<PROJECTID>.api.codehooks.io/dev/
const toDoYup = object({
  ownerId: string().required(),
  title: string().required(),
  description: string().required(),
  category: string().required()
})

async function createToDo(req, res){
  const db = await Datastore.open();
  const doc = db.insertOne('toDo', req.body);
  console.log("win");
  res.status(201).json(doc);
}

app.post('/toDo', createToDo);

// Use Crudlify to create a REST API for any collection
crudlify(app, {toDo: toDoYup})

// bind to serverless runtime
export default app.init();
