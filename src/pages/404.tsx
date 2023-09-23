import { useRouter } from "next/router";
import { useEffect } from "react";

const NotFound = () => {
  const route = useRouter();
  useEffect(() => {
    route.push("/");
  }, [route]);
  return null;
};

export default NotFound;
