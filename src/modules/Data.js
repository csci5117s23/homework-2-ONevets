export async function removeTask(authToken, taskId) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + taskId,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function filterCategories(authToken, category) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/category/" + category,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function completeTask(authToken, task) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + task._id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
      body: JSON.stringify({
        _id: task._id,
        owner_id: task.owner_id,
        title: task.title,
        description: task.description,
        category: task.category,
        completed: !task.completed,
      }),
    }
  );
  return await response.json();
}

export async function getTasks(authToken) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function getTasksDone(authToken) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/done",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function getTask(authToken, taskId) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + taskId,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function editTask(
  authToken,
  id,
  owner_id,
  title,
  description,
  completed,
  category
) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
        "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY
      },
      body: JSON.stringify({
        _id: id,
        owner_id: owner_id,
        title: title,
        description: description,
        completed: completed,
        category: category,
      }),
    }
  );
  return await response.json();
}

export async function addTask(authToken, owner_id, title, description, category){
    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
          "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY
        },
        body: JSON.stringify({
          owner_id: owner_id,
          title: title,
          description: description,
          completed: false,
          category: category,
        }),
      }
    )
    
    return await response.json();
  };
