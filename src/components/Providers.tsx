// src\components\Providers.tsx
"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      {children}
    </>
  );
}
