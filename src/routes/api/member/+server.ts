import { updateMember } from "$lib/server/db/queries/members";
import type { RoleId } from "$lib/types";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const { memberId, departments, roleId, active } = await request.json<{ memberId: number; departments: string[]; roleId: RoleId; active: boolean }>();

    if (!memberId || !roleId) {
        return error(400, 'Missing memberId or roleId');
    }

    const record = await updateMember(memberId, departments, roleId, active);
    return json(record);
};
