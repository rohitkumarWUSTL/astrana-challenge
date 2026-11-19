import { Route, Routes } from "react-router-dom";

import Layout from "@/shared/components/Layout";
import { domains } from "@/core/domains";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-6">
              <h1 className="text-2xl font-semibold">Welcome</h1>
              <p className="mt-2 text-gray-600">
                Pick a domain from the navigation above.
              </p>
            </div>
          }
        />
        {domains.flatMap((d) => d.routes)}
      </Routes>
    </Layout>
  );
}
