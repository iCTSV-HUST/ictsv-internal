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


type CheckinType = { 
	Longitude: number; 
	Latitude: number; 
	CheckInTime: string; 
	CheckInAddress: string; 
};

type Row = {
	UserCode: string;
	FullName: string;
	UserRole: number;
	UAStatus: number;
	Email: string;
	Faculty: string;
	ProofImage: number;
	ProofCheck: number;

	imgSrc?: string;
	coords?: number[][];
	addresses?: string;
	assignedStatus?: string;
}

export type MainTable = {
	rows: Row[];
	rowfocus: number;
}

export const tableData = $state<MainTable>({
	rows: Array(1000).fill(testRows).flat().slice(0, 1000) as Row[],
	rowfocus: 0
})