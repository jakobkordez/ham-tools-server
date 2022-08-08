import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MapLogEntryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.data) {
      value.data = Object.fromEntries(
        Object.entries(value.data).map(([key, value]) => [
          key.toUpperCase(),
          value,
        ]),
      );

      const date = value.data['QSO_DATE'] as string;
      const time = value.data['TIME_ON'] as string;
      const y = date.substring(0, 4);
      const M = date.substring(4, 6);
      const d = date.substring(6, 8);
      const h = time.substring(0, 2);
      const m = time.substring(2, 4);
      value.datetime_on = new Date(`${y}-${M}-${d}T${h}:${m}:00Z`);
    }

    return value;
  }
}
