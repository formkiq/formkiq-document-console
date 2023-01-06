export class ConfigService {

  public static getSystemConfigData(): Promise<any> {
    const isLocal = process.env?.['NODE_ENV'] === 'development' ? true : false
    const url = isLocal ? '/assets/config.local.json' : '/assets/config.json'
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