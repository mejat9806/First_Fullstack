import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full">
      <Button onClick={() => navigate("/user")}>To USER</Button>
    </div>
  );
}

export default Home;
