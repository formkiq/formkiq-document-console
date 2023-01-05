export class ConfigService {

  public static getSystemConfigData(): Promise<any> {
    const url = '/assets/config.json'
    return fetch(url, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).then(function(response) {
        return response.json();
    }).then(function(json) {
        return json
    });
  }

}