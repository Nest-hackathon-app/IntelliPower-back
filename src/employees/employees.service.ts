import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { UsersService } from 'src/user/user.service';
import { PaginationDtoReq } from 'src/common/dto/pagination-req.dto';
type RawRow = Record<string, string>;

export interface NormalizedRow {
  employee_name: string;
  age: string;
  email: string;
  phone_number: string;
  gender: 'Male' | 'Female';
}

@Injectable()
export class EmployeesService {
  constructor(private readonly userServices: UsersService) {}
  async parseMulterToCsv(file: Express.Multer.File, companyId: string) {
    const stringified = file.buffer.toString('utf-8');
    const normalizeData = (await this.parseCsv(stringified)) as NormalizedRow[];
    return this.userServices.createEmployeesWithArray(normalizeData, companyId);
  }
  async parseCsv(csvString: string) {
    return new Promise((resolve, reject) => {
      try {
        const results: RawRow[] = [];
        Readable.from(csvString)
          .pipe(csv())
          .on('data', (data: RawRow) => {
            console.log('Row:', data);
            results.push(data);
          })
          .on('end', () => {
            resolve(this.normalizeData(results));
          });
      } catch (error: unknown) {
        console.error('Error parsing CSV file:', error);
        reject(new Error('Error parsing CSV file'));
      }
    });
  }
  normalizeData(data: RawRow[]): NormalizedRow[] {
    if (!data.length) return [];

    const [headerRow, ...rows] = data;
    const headers = Object.values(headerRow);

    return rows.map((row) => {
      const values = Object.values(row);
      const entry: NormalizedRow = {} as NormalizedRow;

      headers.forEach((key, index) => {
        entry[key] = values[index];
      });

      return entry;
    });
  }
  getCompanyEmployees(companyId: string, q: PaginationDtoReq) {
    return this.userServices.getCompanyEmployees(companyId, q);
  }
}
