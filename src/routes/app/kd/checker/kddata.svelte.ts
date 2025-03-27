export type KDCTSVDataRequired = {
	AId: string;
	TokenCode: string;
	UserName: string;
}

export type KDCTSVResponseType = {
	RespCode: number;
	RespText: string;
	Signature: string;
}

export const kdData = $state<KDCTSVDataRequired>({
	AId: "",
	TokenCode: "",
	UserName: "",
})