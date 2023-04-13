import Head from "next/head";
import { Inter } from "next/font/google";
import { SignedIn, SignIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import styles from "../styles/templates/addmodal.module.css";
import { useState, useEffect } from "react";

export default function AddModal(props) {
  const [wantCategory, setWantCategory] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(props.uniqueCategories[0]);

  function handleCategory() {
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
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {props.uniqueCategories.map((category) => {
              return <option className={styles.categoryOption} value={category}>{category}</option>;
            })}
          </select>
        </>
      );
    }
  }

  useEffect(() => {
    handleCategory();
    setCategory(props.uniqueCategories[0]);
  }, [wantCategory]);

  useEffect(() => {
    setCategory(props.uniqueCategories[0]);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
          },
          body: JSON.stringify({
            owner_id: "1",
            title: title,
            description: description,
            completed: false,
            category: category,
          }),
        }
      ).then((res) => res);
    };
    fetchData();
    props.getTasks();
  }

  function handleButton() {
    document.getElementById("addForm").reset();
  }

  return (
    <>
      <div
        className="modal fade"
        id="addModal"
        tabIndex="-1"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addModalLabel">
                  Create a reminder
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
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
                    onChange={(e) => setTitle(e.target.value)}
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
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <input
                    type="checkbox"
                    onChange={() => setWantCategory(!wantCategory)}
                  ></input>
                  <label className="form-label">Create new category?</label>
                  <br></br>
                  {handleCategory()}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleButton}
                >
                  Close
                </button>
                <button
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleButton}
                  type="submit"
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
