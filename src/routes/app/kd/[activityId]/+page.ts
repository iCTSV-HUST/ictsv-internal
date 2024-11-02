import { kdData } from "../kddata.svelte";
import type { PageLoad } from "./$types";
import { pb } from '$lib/pocketbase';

export const load: PageLoad = async ({ fetch, params }) => {
  const jsonBody = JSON.stringify({
    AId: params.activityId,
    Signature: "sample string 4",
    Search: "",
    URole: 0,
    UStatus: 0,
    UProof: 1,
    NumberRow: 9999,
    PageNumber: 1,


    TokenCode: kdData.TokenCode,
    UserName: pb.authStore.model?.usercode,
  });

  const getRows = fetch("https://ctsv.hust.edu.vn/api-t/Activity/GetUserActivityByAId", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
    body: jsonBody,
    
  });

  return {
    getRows
  }
}