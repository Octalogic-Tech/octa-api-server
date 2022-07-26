// tslint:disable-next-line: no-import-side-effect
import "module-alias/register";
import * as functions from "firebase-functions";
import server from "./app";
import { connectToServer } from "./utils/db";

connectToServer();

export const api = functions
  .runWith({
    memory: "1GB",
  })
  .region("asia-east2")
  .https.onRequest(server);
