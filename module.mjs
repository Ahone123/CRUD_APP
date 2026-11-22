// @ts-check
import { module } from "@prisma/composer";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import backendContractJson from "./backend/src/prisma/contract.json" with { type: "json" };
import backendService from "./backend/src/service.mjs";

export default module("crud-app-db", ({ provision }) => {
  const database = provision(
    postgres({
      name: "database",
      contract: dataContract(backendContractJson),
      config: "./prisma.config.ts",
    }),
  );
  provision(backendService, { deps: { db: database } });
});
