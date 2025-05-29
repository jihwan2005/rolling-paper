import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/see-notification-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { seeNotification } from "../../data/mutations";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  await seeNotification(client, {
    userId,
  });
};
