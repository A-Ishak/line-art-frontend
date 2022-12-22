import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EmailToLowerCasePipe implements PipeTransform {
  transform(payload: any) {
    payload.email = payload.email.toLowerCase();
    return payload;
  }
}
