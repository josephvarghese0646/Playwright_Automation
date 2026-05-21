import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Helper - Load and manage test data from external files
 */
export class TestDataHelper {
  private static dataPath = path.join(process.cwd(), 'test-data');

  /**
   * Load JSON test data file
   */
  static loadJsonData<T>(filename: string): T {
    const filePath = path.join(this.dataPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Load CSV test data file
   */
  static loadCsvData(filename: string): string[][] {
    const filePath = path.join(this.dataPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return data
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.split(',').map((cell) => cell.trim()));
  }

  /**
   * Get test data by key
   */
  static getTestData<T>(filename: string, key?: string): T {
    const data = this.loadJsonData<any>(filename);
    if (key) {
      return data[key];
    }
    return data;
  }
}
