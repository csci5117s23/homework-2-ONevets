import Head from "next/head";
import { Inter } from "next/font/google";
import { SignedIn, SignIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import styles from "../styles/to-do.module.css";
import NavBar from "../templates/navbar";
import AddModal from "../templates/addmodal";
import EditModal from "../templates/editmodal";
import { useEffect, useState } from "react";

export default function Todos({ Component, pageProps }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [persistentTasks, setPersistentTasks] = useState([]);
  const [onHomePage, setOnHomePage] = useState(true);

  async function removeTask(taskId) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + taskId,
      {
        method: "DELETE",
        headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
      }
    ).then((res) => res);
    getTasks();
  }

  function filterCategories(category) {
    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/?category=" + category,
        {
          method: "GET",
          headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
        }
      );
      const data = await response.json();
      // update state -- configured earlier.
      setTasks(data);
      setLoading(false);
    };
    fetchData();
  }

  async function completeTask(task) {
    if (task.completed === false) {
      task.completed = true;
    } else {
      task.completed = false;
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + task._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
        },
        body: JSON.stringify({
          _id: task._id,
          ownerId: task.ownerId,
          title: task.title,
          description: task.description,
          category: task.category,
          completed: task.completed,
        }),
      }
    ).then(getTasks());
  }

  const getTasks = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo",
      {
        method: "GET",
        headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
      }
    );
    const data = await response.json();
    // update state -- configured earlier.
    setTasks(data);
    setLoading(false);
  };

  const getPersistentTasks = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo",
      {
        method: "GET",
        headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
      }
    );
    const data = await response.json();
    // update state -- configured earlier.
    setPersistentTasks(data);
  };

  useEffect(() => {
    getTasks();
    getPersistentTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <NavBar
          getTasks={getTasks}
          tasks={tasks}
          setTasks={setTasks}
          loading={loading}
          setLoading={setLoading}
          setOnHomePage={setOnHomePage}
        ></NavBar>
        <div className={`${styles.maxheight} container-fluid text-center`}>
          <div className={`${styles.maxheight} row`}>
            <div className={`${styles.leftmenu} col`}>
              {/* This is a template */}
              <h1>Categories</h1>
              {onHomePage ? (
                persistentTasks.map((task, key) => {
                  return (
                    <>
                      <p onClick={() => filterCategories(task.category)}>
                        {task.category}
                      </p>
                    </>
                  );
                })
              ) : (
                <p>To see full list again, Go to home on the navbar</p>
              )}
            </div>
            <div className={`${styles.rightmenu} col-9`}>
              <h1>Tasks</h1>
              {/* This is a template */}
              {tasks.map((task) => {
                return (
                  <>
                    <div className="container">
                      <h2>{task.title}</h2>
                      <h3>Category: {task.category}</h3>
                      <p>{task.description}</p>
                      <input
                        type="checkbox"
                        id="completedCheckbox"
                        name="completed"
                        defaultChecked={task.completed}
                        onChange={(e) => completeTask(task)}
                      ></input>
                      <label htmlFor="completedCheckbox">
                        {" "}
                        Check to complete
                      </label>
                      <br></br>
                      <button
                        className={`btn btn-primary`}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-${task._id}`}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn btn-primary`}
                        type="button"
                        onClick={(e) => removeTask(task._id)}
                      >
                        Remove
                      </button>
                      <EditModal
                        parentTasks={tasks}
                        parentTask={task}
                        persistentTasks={persistentTasks}
                        getTasks={getTasks}
                        getPersistentTasks={getPersistentTasks}
                      ></EditModal>
                    </div>
                    <hr></hr>
                  </>
                );
              })}
            </div>
            <button
              className={`${styles.addToDo} btn btn-primary`}
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#addModal"
            >
              +
            </button>
            <AddModal
              persistentTasks={persistentTasks}
              parentTasks={tasks}
              getTasks={getTasks}
            ></AddModal>
          </div>
        </div>
      </>
    );
  }
}
