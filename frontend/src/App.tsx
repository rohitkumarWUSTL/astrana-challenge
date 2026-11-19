import { createBrowserRouter } from "react-router-dom";

import { domains } from "@/core/domains";
import Layout from "@/shared/components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <div className="p-6">
            <h1 className="text-2xl font-semibold">Welcome</h1>
            <p className="mt-2 text-gray-600">
              Pick a domain from the navigation above.
            </p>
          </div>
        ),
      },
      ...domains.flatMap((d) => d.routes),
    ],
  },
]);

export default router;
