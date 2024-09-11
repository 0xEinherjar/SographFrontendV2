export default class ReportGateway {
  #httpClient;
  #baseUrl;

  constructor(httpClient, baseUrl) {
    this.#httpClient = httpClient;
    this.#baseUrl = baseUrl;
  }

  async create(params) {
    const result = await this.#httpClient.request({
      url: `${this.#baseUrl}/report`,
      method: "post",
      data: {
        reason: params.reason,
        reported: params.reported,
        whistleblower: params.whistleblower,
      },
    });
    return {
      status: result.status,
    };
  }

  async load() {
    const result = await this.#httpClient.request({
      url: `${this.#baseUrl}/report`,
      method: "get",
    });
    return {
      result: result.body,
      status: result.status,
    };
  }
}
