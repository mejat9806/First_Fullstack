import { Form } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/login";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

function FormComponent() {
  const navigate = useNavigate();
  const FormSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Please enter a valid email address" })
      .email(),
    password: z.string().min(4),
  });
  // .superRefine(({ confirmPassword, password }, ctx) => {
  //   if (confirmPassword !== password) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "The passWord did not match",
  //     });
  //   }
  // });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "mejats@test.com",
      password: "mav989698",
    },
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    login(values.email, values.password);
    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 capitalize"
      >
        <FormInput
          form={form}
          label={"email"}
          placeholder={"email"}
          name="email"
          type="email"
        />
        <FormInput
          form={form}
          label={"password"}
          placeholder={"password"}
          name="password"
          type="password"
        />

        <Button type="submit" className="hover:bg-slate-600 ">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default FormComponent;
