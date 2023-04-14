import { Inter } from "next/font/google";
import { useAuth, useUser, UserButton, SignIn } from '@clerk/nextjs';
import { useClerk } from "@clerk/clerk-react";
const inter = Inter({ subsets: ["latin"] });
import styles from "../styles/templates/navbar.module.css";
import Link from "next/link";


export default function Navbar(props) {
  const { signOut } = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const {user, isSignedIn} = useUser();

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
                <Link className="nav-link" href="/todos">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/done">
                  Completed
                </Link>
              </li>
            </ul>
            <ul className={`navbar-nav ms-auto`}>
              <li className={`nav-item`}>
                <a className="nav-link">{(isLoaded || isSignedIn) ? user.primaryEmailAddress.emailAddress : "" }</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/" onClick={() => signOut()}>
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
