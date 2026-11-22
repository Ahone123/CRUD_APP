import service from "../service.mjs";

const { db } = service.load();

const prisma = db.client;

export default prisma;
