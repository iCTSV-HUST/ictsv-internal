import { goto, invalidateAll } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';

export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

// pb.authStore.onChange(() => {
// 	pbUser.set(pb.authStore.model);
// }, true);

export async function logout() {
	pb.authStore.clear();
	await invalidateAll();
	goto('/?message="Logged out"');
}