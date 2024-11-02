import { goto } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';

export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

export async function logout() {
	pb.authStore.clear();
	goto('/login?positive=true&message=Logged out');
}