import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import styles from "../../styles/to-do.module.css";
import NavBar from "../../components/navbar";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import * as db from "../../modules/Data";

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

  const [saved, setSaved] = useState(false);

  const { isLoaded, userId, sessionId, getToken } = useAuth();

  function handleCategory() {
    if (wantCategory === true) {
      return (
        <>
          <label>Insert category name here</label> <br></br>
          <input
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            required
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
    const token = await getToken({ template: "codehooks" });
    const data = await db.getTask(token, taskId);
    setTaskToEdit(data);
    setTitle(data.title);
    setDescription(data.description);
    setCategory(data.category);
    setLoading(false);
  };

  const getTasks = async () => {
    const token = await getToken({ template: "codehooks" });
    const getTasksVar = await db.getTasks(token);

    setTasks(getTasksVar);
    setLoading(false);
  };

  function getUniqueCategories(arr) {
    let newArr = [];
    arr.forEach((item) => {
      newArr.push(item.category);
    });
    const setData = new Set(newArr);
    setUniqueCategories(Array.from(setData));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = await getToken({ template: "codehooks" });
    const getTasksVar = await db.editTask(
      token,
      taskToEdit._id,
      taskToEdit.owner_id,
      title,
      description,
      taskToEdit.completed,
      category
    );

    setSaved(true);
  }

  useEffect(() => {
    getTask(routerQuery.id);
    getTasks();
  }, []);

  useEffect(() => {
    getUniqueCategories(tasks);
  }, [tasks.length]);

  useEffect(() => {
    if(saved){
      router.push("/todos");
    }
  }, [saved]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Head>
          <title>Homework - Edit</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <NavBar></NavBar>
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
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
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
                  required
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
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
