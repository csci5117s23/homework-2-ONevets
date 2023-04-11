import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useState, useEffect } from "react";

export default function AddModal(props) {
  const [wantCategory, setWantCategory] = useState(false);
  const [title, setTitle] = useState(props.taskToEdit.title);
  const [description, setDescription] = useState(props.taskToEdit.description);
  const [category, setCategory] = useState(props.taskToEdit.category);


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
          <select
            defaultValue={props.taskToEdit.category}
            key={props.taskToEdit.category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {props.uniqueCategories.map((category) => {
              return <option value={category}>{category}</option>;
            })}
          </select>
        </>
      );
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DB_API_ENDPOINT +
          "/toDo/" +
          props.taskToEdit._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY,
          },
          body: JSON.stringify({
            _id: props.taskToEdit._id,
            owner_id: props.taskToEdit.owner_id,
            title: title,
            description: description,
            completed: props.taskToEdit.completed,
            category: category,
          }),
        }
      ).then((res) => res);
    };
    fetchData();
    props.getTasks();
  }

  function handleCancel(e) {
    document.getElementById("editForm").reset();
    props.setModalOpen(false);
  }

  useEffect(() => {
    setTitle(props.taskToEdit.title);
    setDescription(props.taskToEdit.description);
    setCategory(props.taskToEdit.category);
  }, [props.modalOpen]);
  return (
    <>
      <div
        className="modal fade"
        id={`modal`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form id="editForm" onSubmit={(e) => handleSubmit(e)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editModalLabel">
                  Edit a reminder
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
                    defaultValue={props.taskToEdit.title}
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
                    defaultValue={props.taskToEdit.description}
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={(e) => handleCancel(e)}
                >
                  Cancel
                </button>
                <button
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => props.setModalOpen(false)}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
