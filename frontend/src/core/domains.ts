import type { RouteObject } from "react-router-dom";

import { musicDomain } from "@/domains/music";

export type DomainModule = {
  name: string;
  navLabel: string;
  basePath: string;
  routes: RouteObject[];
};

export const domains: DomainModule[] = [musicDomain];
