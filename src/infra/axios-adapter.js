import axios from "axios";

export default class AxiosHttpClient {
  async request(data) {
    let axiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.data,
        headers: data.headers,
        params: data.params,
        responseType: data.responseType,
      });
    } catch (error) {
      axiosResponse = error.response;
    }
    return {
      status: axiosResponse.status,
      body: axiosResponse.data,
      contentType: axiosResponse.headers["content-type"],
    };
  }
}
