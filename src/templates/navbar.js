import { Inter } from "next/font/google";
import { SignedIn, SignIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import styles from "../styles/templates/navbar.module.css";
import Link from "next/link";

export default function Navbar(props) {

  const filterAll = () => {
    props.getTasks();
    props.setOnHomePage(true);
  }

  function filterCompleted() {
    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_DB_API_ENDPOINT + "/toDo/completed",
        {
          method: "GET",
          headers: { "x-apikey": process.env.NEXT_PUBLIC_DB_API_KEY },
        }
      );
      const data = await response.json();
      // update state -- configured earlier.
      props.setTasks(data);
      props.setLoading(false);
    };
    fetchData();
    props.setOnHomePage(false);
  }

  return (
    <>
      <nav
        className={`${styles.customNav} navbar navbar-expand-lg bg-body-tertiary`}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            To-do List
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" onClick={filterAll}>Home</a>
              </li>
              <li className="nav-item">
              <a className="nav-link" onClick={filterCompleted}>Completed</a>
              </li>
              
            </ul>
            <ul className={`navbar-nav ms-auto`}>
                <li className={`nav-item`}>
                    <a className="nav-link">Name here</a>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/">Sign out</Link>
                </li>
              </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
