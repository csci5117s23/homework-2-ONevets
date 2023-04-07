import Head from "next/head";
import { Inter } from "next/font/google";
import { SignedIn, SignIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import { useState } from "react";

export default function AddModal() {
  const [category, addCategory] = useState(true);

  function handleCategoryClick() {
    if (category === false) {
      console.log("category is false");
      addCategory(true);
    } else {
      console.log("category is true");
      addCategory(false);
    }
  }

  function handleCategory() {
    if (category === true) {
      return (
        <>
          <label>Insert category name here</label> <br></br>
          <input type="text"></input>
        </>
      );
    } else {
      return (
        <>
          <p>Hello</p>
        </>
      );
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form action="/todo" method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
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
                  <label for="exampleInputEmail1" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">
                    Details
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <input type="checkbox" onChange={handleCategoryClick} checked={category}></input>
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
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
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
