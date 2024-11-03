import { goto } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';
import { currentUser } from './user.svelte';

export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

export async function logout() {
	pb.authStore.clear();
	currentUser.clear();
	goto('/login?positive=true&message=Logged out');
}