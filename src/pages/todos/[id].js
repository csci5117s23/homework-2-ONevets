import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { SignedIn, SignIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import styles from "../../styles/to-do.module.css";
import NavBar from "../../templates/navbar";
import { useEffect, useState } from "react";

export default function EditToDos() {
  const router = useRouter();
  const routerQuery = router.query;
  const [wantCategory, setWantCategory] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  function handleCategory() {
    console.log(uniqueCategories);
    if (wantCategory === true) {
      return (
        <>
          <label>Insert category name here</label> <br></br>
          <input
            onChange={(e) => setCategory(e.target.value)}
            type="text"
          ></input>
        </>
      );
    } else {
      return (
        <>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {uniqueCategories.map((category) => {
              return <option value={category}>{category}</option>;
            })}
          </select>
        </>
      );
    }
  }

  const getTask = async (taskId) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/" + taskId,
      {
        method: "GET",
        headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
      }
    );
    const data = await response.json();
    setTaskToEdit(data);
    setTitle(data.title);
    setDescription(data.description);
    setCategory(data.category);
    setLoading(false);
    console.log(taskToEdit);
  };

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

  function getUniqueCategories(arr) {
    let newArr = [];
    arr.forEach((item) => {
      newArr.push(item.category);
    });
    const setData = new Set(newArr);
    console.log(Array.from(setData));
    setUniqueCategories(Array.from(setData));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DB_API_ENDPOINT +
          "/toDo/" + taskToEdit._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
          },
          body: JSON.stringify({
            _id: taskToEdit._id,
            owner_id: taskToEdit.owner_id,
            title: title,
            description: description,
            completed: taskToEdit.completed,
            category: category,
          }),
        }
      ).then((res) => res);
    };
    fetchData();

    // window.location.href = "/todos";
  }

  useEffect(() => {
    getTask(routerQuery.id);
    getTasks();
  }, []);

  useEffect(() => {
    getUniqueCategories(tasks);
    
  }, [tasks.length]);

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
        ></NavBar>
        <div className={`${styles.maxheight} container-fluid text-center`}>
        <form id="editForm" onSubmit={(e) => handleSubmit(e)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editModalLabel">
                  Edit a reminder
                </h1>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    aria-describedby="title"
                    defaultValue={title}
                    onChange={(e) => {console.log(title); setTitle(e.target.value);}}
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Details
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="description"
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <input
                    type="checkbox"
                    onChange={() => setWantCategory(!wantCategory)}
                    checked={wantCategory}
                  ></input>
                  <label className="form-label">Create new category?</label>
                  <br></br>
                  {handleCategory()}
                </div>
              </div>

              <div className="modal-footer">
                <Link href="/todos">Cancel</Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
        </div>
      </>
    );
  }
}
