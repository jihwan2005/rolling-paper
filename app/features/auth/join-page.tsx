import { Form, Link, useNavigation } from "react-router";
import type { Route } from "./+types/join-page";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";

import { redirect } from "react-router";
import { LoaderCircle } from "lucide-react";
import { checkUsernameExists } from "./queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Join | wemake" }];
};

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
    };
  }
  const usernameExists = await checkUsernameExists(request, {
    username: data.username,
  });
  if (usernameExists) {
    return {
      formErrors: { username: ["Username already exists"] },
    };
  }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { username: data.username },
    },
  });
  if (signUpError) {
    return {
      signUpError: signUpError.message,
    };
  }
  return redirect("/", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full mt-20">
      <button className="absolute right-8 top-8 ">
        <Link to="/auth/login">Login</Link>
      </button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <Form className="w-full space-y-4" method="post">
          <input
            id="username"
            name="username"
            required
            type="text"
            placeholder="username"
            className="border-2 rounded-sm p-2 w-full"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.username}</p>
          )}
          <input
            id="email"
            name="email"
            required
            type="email"
            placeholder="email"
            className="border-2 rounded-sm p-2 w-full"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.email}</p>
          )}
          <input
            id="password"
            name="password"
            required
            type="password"
            placeholder="password"
            className="border-2 rounded-sm p-2 w-full"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.password}</p>
          )}
          <button
            className="w-full border-2 p-2 rounded-sm hover:bg-gray-200 cursor-pointer flex items-center justify-center"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
          {actionData && "signUpError" in actionData && (
            <p className="text-red-500">{actionData.signUpError}</p>
          )}
        </Form>
      </div>
    </div>
  );
}
