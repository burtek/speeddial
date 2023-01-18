import { kill as killChild } from "node:process";
import { join } from "node:path";

// @ts-ignore
import { startDevServer } from "@vercel/node";

const IMAGE_URL = "https://local.dev";

describe("api/image2data", () => {
  let pid: number;
  let port: number;

  beforeAll(async () => {
    const devServer: { pid: number; port: number } = await startDevServer({
      entrypoint: "image2data.ts",
      workPath: join(__dirname, ".."),
      config: {},
    });

    console.log(__dirname, devServer);

    ({ pid, port } = devServer);
  });

  afterAll(() => {
    killChild(pid);
  });

  it("should generate correct string", async () => {
    const data = await fetch(
      `http://localhost:${port}/api/image2data?url=https://via.placeholder.com/150`
    );

    await expect(data.json()).resolves.toMatchSnapshot();
  });
});
