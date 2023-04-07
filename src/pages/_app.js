import { ClerkProvider } from "@clerk/nextjs";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
    },[]);
    
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
