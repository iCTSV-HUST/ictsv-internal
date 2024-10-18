/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Attendances = "attendances",
	Departments = "departments",
	Members = "members",
	Roles = "roles",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AttendancesRecord = {
	date: IsoDateString
	members?: RecordIdString[]

	id: RecordIdString
}

export type DepartmentsRecord = {
	name: string
}

export type MembersRecord = {
	active?: boolean
	avatar?: string
	department: RecordIdString[]
	generation: number
	name: string
	role: RecordIdString
	usercode: string

	id: RecordIdString
}

type MembersExpand = {
	expand: {
		department: DepartmentsRecord[]
		role: RolesRecord
	}
}

export type MembersRequiredRecord = MembersRecord & MembersExpand;

export type RolesRecord = {
	codename: string
	name: string
	rank: number
}

// Response types include system fields and match responses from the PocketBase API
export type AttendancesResponse<Texpand = unknown> = Required<AttendancesRecord> & BaseSystemFields<Texpand>
export type DepartmentsResponse<Texpand = unknown> = Required<DepartmentsRecord> & BaseSystemFields<Texpand>
export type MembersResponse<Texpand = unknown> = Required<MembersRecord> & AuthSystemFields<Texpand>
export type RolesResponse<Texpand = unknown> = Required<RolesRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	attendances: AttendancesRecord
	departments: DepartmentsRecord
	members: MembersRecord
	roles: RolesRecord
}

export type CollectionResponses = {
	attendances: AttendancesResponse
	departments: DepartmentsResponse
	members: MembersResponse
	roles: RolesResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'attendances'): RecordService<AttendancesResponse>
	collection(idOrName: 'departments'): RecordService<DepartmentsResponse>
	collection(idOrName: 'members'): RecordService<MembersResponse>
	collection(idOrName: 'roles'): RecordService<RolesResponse>
}
