export type KDiCTSVDataType = {
	AId: string;
	TokenCode: string;
}

export const kdData = $state<KDiCTSVDataType>({
	AId: "",
	TokenCode: "",
})