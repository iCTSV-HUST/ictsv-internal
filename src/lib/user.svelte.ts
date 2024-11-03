import type { MemberInfo } from './appimportant.svelte';
import type { MembersRequiredRecord } from './pocketbase-types';

const memberRecordToInfo = (m: MembersRequiredRecord): MemberInfo => {
	return {
		active: m.active ?? false,
		avatar: m.avatar ?? "",
		name: m.name,
		usercode: m.usercode,

		department: m.expand.department.map(dept => dept.name),
		role: m.expand.role.name,
		rank: m.expand.role.rank,
		generation: m.generation,
		id: m.id,
	}
}

const memberTemp: MemberInfo = {
    active: false,
    avatar: '',
    name: 'Temp',
    usercode: '',
    department: [],
    role: '',
    rank: 0,
    generation: 0,
    id: ''
}

class User {
	#info = $state<MemberInfo | null>(null);
	lastLogin = new Date('2020-06-29T00:00:00');

	get info() {
		return this.#info ?? memberTemp;
	}

	set info(member: MemberInfo) {
		console.log("Setter");
		this.#info = member;
		sessionStorage.setItem("currentUser", JSON.stringify(member));
	}

	clear() {
		this.#info = null;
		this.lastLogin = new Date('2020-06-29T00:00:00');
		sessionStorage.clear();
	}

	tryRefresh() {
		if (this.#info !== null && JSON.stringify(this.#info) !== '{}') {
			return true;
		}

		const memberTest = JSON.parse(sessionStorage.getItem('currentUser') ?? "null");

		if (memberTest !== null && JSON.stringify(memberTest) !== '{}') {
			this.info = memberTest;
			return true;
		}
		return false;
	}

	setInfoFromRecord(member: MembersRequiredRecord) {
		this.info = memberRecordToInfo(member);
	}
}

export const currentUser = new User();

