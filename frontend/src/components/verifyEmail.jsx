import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }, []);

  return <h2>Verifying your email...</h2>;
}

export default VerifyEmail;