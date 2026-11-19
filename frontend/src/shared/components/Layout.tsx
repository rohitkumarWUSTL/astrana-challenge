import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { domains } from "@/core/domains";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const location = useLocation();

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg">
            App
          </Link>
          <nav className="flex gap-4">
            {domains.map((d) => {
              const active = location.pathname.startsWith(d.basePath);
              return (
                <Link
                  key={d.name}
                  to={d.basePath}
                  className={
                    active
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }
                >
                  {d.navLabel}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
