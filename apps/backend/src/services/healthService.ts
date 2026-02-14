export class HealthService {
  static checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'car-doctor-server',
      version: '1.0.0',
    };
  }
}
