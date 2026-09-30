import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { handle, json } from "@/lib/http";
import { pickerSession } from "@/modules/integrations/gdrive/attachments";

/**
 * GET /api/v1/integrations/google-drive/picker-session — what the Google Picker needs in the
 * browser: the member's own short-lived access token (refreshed if needed), API key and app id.
 * 409 PERSONAL_CONNECTION_REQUIRED means the member connects their Google account first.
 */
export const GET = handle(async (req: Request) => {
  const ctx = await getRequestContext(req);
  return json(await pickerSession(getDb(), ctx));
});
