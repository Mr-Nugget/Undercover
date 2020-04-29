import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSpaceByDash'
})
export class ReplaceSpaceByDashPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/\s/g, '-');
  }

}
