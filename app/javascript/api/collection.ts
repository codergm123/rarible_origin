import axios from "axios";
import { IAssetData } from "../helpers/types";

export async function createNewCollection(params: object, token: string): Promise<IAssetData[]> {
  const config = {
    headers: {
      'X-CSRF-TOKEN': token,
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }

  let resp = await axios.post(`/collections`, params, config)
    .then((response: object) => {
      return response
    })
    .catch(err => {
      console.log("Collection Create Error", err)
    })
  return resp;
}
