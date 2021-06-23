import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ChangeStringCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('Data passed in Pipe : ' + JSON.stringify(value));
    return value;
  }
}
