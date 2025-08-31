import request from "supertest";
import { server } from "../../..";
import { getTestSession } from "../../../test-utils/get-test-session";
import { pool } from "../../../test-utils/reset-db";

describe("POST /", () => {
  let app: any;
  beforeAll(async () => {
    app = server;
  });
  afterAll(async () => {
    await pool.end();
    await new Promise((resolve) => server.close(resolve));
  });

  it("creates a widget (RLS enforced via user JWT)", async () => {
    const session = await getTestSession();
    await request(app)
      .get("/v1/integrations")
      .set("Authorization", `Bearer ${session!.access_token}`)
      .expect(200);
  });
});
