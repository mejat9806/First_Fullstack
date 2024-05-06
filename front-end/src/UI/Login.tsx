import FormComponent from "./FormComponent";
function Login() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-svh ">
      <div className="bg-muted p-6 w-[30%]">
        <h1 className="Header">Sign In</h1>
        <FormComponent />
      </div>
    </div>
  );
}

export default Login;
