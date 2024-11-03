import type { MemberInfo } from './appimportant.svelte';

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

class User {
	#info = $state<MemberInfo>({});
	lastLogin = new Date('2020-06-29T00:00:00');

	get info() {
		return this.#info;
	}

	set info(member: MemberInfo) {
		console.log("Setter");
		this.#info = member;
		sessionStorage.setItem("currentUser", JSON.stringify(member));
	}

	tryRefresh() {
		if (this.#info !== null && JSON.stringify(this.#info) !== '{}') {
			return true;
		}

		const memberTest = JSON.parse(sessionStorage.getItem('currentUser'));

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

