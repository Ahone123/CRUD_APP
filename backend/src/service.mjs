import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import backendContractJson from "./prisma/contract.json" with { type: "json" };

export default compute({
  name: "backend",
  deps: { db: postgres(dataContract(backendContractJson)) },
  build: node({ module: import.meta.url, dir: ".", entry: "server.js", dependencies: "external" }),
});
