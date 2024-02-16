"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Redirect = ({ url }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(`${url}`);
  }, []);
  return null;
};

export default Redirect;
