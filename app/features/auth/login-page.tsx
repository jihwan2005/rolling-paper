import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login-page";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login | wemake" }];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }
  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col relative items-center justify-center h-full mt-20">
      <button className="absolute right-8 top-8">
        <Link to="/auth/join">Join</Link>
      </button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Log in to your account</h1>
        <Form className="w-full space-y-4" method="post">
          <input
            name="email"
            id="email"
            required
            type="email"
            placeholder="email"
            className="w-full border-2 rounded-sm p-2"
          />
          {actionData?.formErrors?.email && (
            <p className="text-red-500">
              {actionData.formErrors?.email.join(", ")}
            </p>
          )}
          <input
            id="password"
            name="password"
            required
            type="password"
            placeholder="password"
            className="w-full border-2 rounded-sm p-2"
          />
          {actionData?.formErrors?.password && (
            <p className="text-red-500">
              {actionData.formErrors.password.join(", ")}
            </p>
          )}
          <button
            className="w-full border-2 rounded-sm p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-center"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Log in"
            )}
          </button>
          {actionData?.loginError && (
            <p className="text-red-500">{actionData.loginError}</p>
          )}
        </Form>
      </div>
    </div>
  );
}
