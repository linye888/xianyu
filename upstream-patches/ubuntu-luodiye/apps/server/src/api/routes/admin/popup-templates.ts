import { Hono } from "hono";
import type { Context } from "hono";
import {
  getPopupTemplate,
  listPopupTemplates,
  renderPopupTemplate,
} from "@luodiye/templates";
import type { Env } from "../../env";
import { verifyToken } from "../../lib/auth";
import { authMiddleware } from "../../middleware/auth";
import { errorResponse, jsonResponse } from "../../lib/utils";

const app = new Hono<{ Bindings: Env }>();

/** Allow Bearer header or ?token= for iframe / new-tab preview */
async function requireUser(c: Context<{ Bindings: Env }>) {
  const header = c.req.header("Authorization");
  const fromHeader = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const fromQuery = c.req.query("token");
  const token = fromHeader || fromQuery;
  if (!token) return null;
  return verifyToken(token, c.env.JWT_SECRET);
}

app.get("/", authMiddleware, async (c) => jsonResponse(listPopupTemplates()));

app.get("/:id/preview", async (c) => {
  const user = await requireUser(c);
  if (!user) return errorResponse("Unauthorized", 401);
  const id = c.req.param("id");
  const html = renderPopupTemplate(id);
  if (!html) return errorResponse("弹窗模板不存在", 404);
  return c.html(html);
});

app.get("/:id", authMiddleware, async (c) => {
  const template = getPopupTemplate(c.req.param("id"));
  if (!template) return errorResponse("弹窗模板不存在", 404);
  return jsonResponse({
    id: template.id,
    name: template.name,
    description: template.description,
    locale: template.locale,
    brand: template.brand,
    category: template.category,
    previewHint: template.previewHint,
  });
});

export default app;
