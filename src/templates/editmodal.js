import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useState } from "react";

export default function AddModal(props) {
  const [wantCategory, setWantCategory] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  function handleCategoryClick(props) {
    if (wantCategory === false) {
      console.log("wantCategory is false");
      setWantCategory(true);
    } else {
      console.log("wantCategory is true");
      setWantCategory(false);
    }
  }

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
            defaultValue={props.parentTask.category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {props.parentTasks.map((task) => {
              return <option value={task.category}>{task.category}</option>;
            })}
          </select>
        </>
      );
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(title);
    console.log(description);
    console.log(category);
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
            category: category,
          }),
        }
      );
      return response.json();
    };
    fetchData();
  }

  function handleCancel(e){
    document.getElementById("editForm").reset();
    setTitle(props.parentTask.title);
    setDescription(props.parentTask.description);
    setCategory(props.parentTask.category);
  }

  return (
    <>
      <div
        className="modal fade"
        id={`modal-${props.parentTask._id}`}
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
                    defaultValue={props.parentTask.title}
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
                    defaultValue={props.parentTask.description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <input
                    type="checkbox"
                    onChange={handleCategoryClick}
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
                <button type="submit" className="btn btn-primary">
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
