const testRows = [{
	"UAId": 0,
	"UserCode": "20193051",
	"FullName": "B\u00f9i Thanh Phong",
	"AId": 7003,
	"UserRole": 2,
	"URDesc": "Th\u00e0nh vi\u00ean",
	"UANote": "",
	"UAComment": "",
	"UALevel": 0.0,
	"CheckInTime": "2023-05-13 19:03:50",
	"CheckOutTime": "2023-05-13 19:03:50",
	"CheckInPlace": "",
	"CreateDate": "2023-05-13 19:03:50",
	"CreateUser": "",
	"UAStatus": 2,
	"NumberCheck": 0,
	"AssessDate": "2023-05-13 19:03:50",
	"AssessUser": "",
	"Reason": "",
	"Email": "phong.bt193051@sis.hust.edu.vn",
	"Faculty": "Tr\u01b0\u1eddng \u0110i\u1ec7n - \u0110i\u1ec7n t\u1eed",
	"ProofImage": 1,
	"ProofCheck": 1
},
{
	"UAId": 0,
	"UserCode": "20203464",
	"FullName": "B\u00f9i V\u0103n Hu\u1ef3nh",
	"AId": 7003,
	"UserRole": 2,
	"URDesc": "Th\u00e0nh vi\u00ean",
	"UANote": "",
	"UAComment": "",
	"UALevel": 0.0,
	"CheckInTime": "2023-05-13 19:03:50",
	"CheckOutTime": "2023-05-13 19:03:50",
	"CheckInPlace": "",
	"CreateDate": "2023-05-13 19:03:50",
	"CreateUser": "",
	"UAStatus": 2,
	"NumberCheck": 0,
	"AssessDate": "2023-05-13 19:03:50",
	"AssessUser": "",
	"Reason": "",
	"Email": "huynh.bv203464@sis.hust.edu.vn",
	"Faculty": "Tr\u01b0\u1eddng \u0110i\u1ec7n - \u0110i\u1ec7n t\u1eed",
	"ProofImage": 1,
	"ProofCheck": 1
},
{
	"UAId": 0,
	"UserCode": "20195403",
	"FullName": "Cao Huy Hi\u1ec7u",
	"AId": 7003,
	"UserRole": 2,
	"URDesc": "Th\u00e0nh vi\u00ean",
	"UANote": "",
	"UAComment": "",
	"UALevel": 0.0,
	"CheckInTime": "2023-05-13 19:03:50",
	"CheckOutTime": "2023-05-13 19:03:50",
	"CheckInPlace": "",
	"CreateDate": "2023-05-13 19:03:50",
	"CreateUser": "",
	"UAStatus": 2,
	"NumberCheck": 0,
	"AssessDate": "2023-05-13 19:03:50",
	"AssessUser": "",
	"Reason": "",
	"Email": "hieu.ch195403@sis.hust.edu.vn",
	"Faculty": "Tr\u01b0\u1eddng C\u01a1 kh\u00ed",
	"ProofImage": 1,
	"ProofCheck": 1
},
]


type Row = {
	index: number;
	
	UserCode: string;
	FullName: string;
	UserRole: number;
	UAStatus: number;
	Email: string;
	Faculty: string;
	ProofImage: number;
	ProofCheck: number;

	imageAsset?: string;
	coords?: number[][];
	addresses?: string;
	assignedStatus?: string;
}


import type { KDCTSVResponseType } from "../kddata.svelte";

export type GetAllResult = KDCTSVResponseType & {
	UserActivityLst: Row[];
	NumberPage: number;	
}


class MainTable {
	rows = $state<Row[]>(testRows.map((r, index) => ({...r, index })));
	rowfocus = $state(0);
	filter = $state({
		max: 0,
		min: 0,
		list: new Array<string>()
	});

	#mssvRowMap: { [key: string]: number } = {};

	initialize(rowList: Row[]) {
		this.#mssvRowMap = {};

		for (let i = 0; i < rowList.length; i++) {
			rowList[i].index = i;
			this.#mssvRowMap[rowList[i].UserCode] = i;
		}

		this.rows = rowList;
		this.filter.min = 0;
		this.filter.max = this.rows.length;
		this.filter.list = [];
	}

	focusUp() {
		if (this.rowfocus > 0) {
			this.rowfocus--;
		}
	}

	focusDown() {
		if (this.rowfocus < this.rows.length) {
			this.rowfocus++;
		}
	}

	get currentRow() {
		return this.rows[this.rowfocus];
	}

	displayRows = $derived.by(() => {
		let filteredList = this.rows.slice(this.filter.min, this.filter.max);

		if (this.filter.list.length !== 0) {
			const allRowsMap = new Map(filteredList.map(row => [row.UserCode, row]));	// Map for fast lookup
			
			filteredList = this.filter.list.map(id => allRowsMap.get(id)).filter(Boolean) as Row[];
		}
		return filteredList;
	})
}

export const tableData = new MainTable();
