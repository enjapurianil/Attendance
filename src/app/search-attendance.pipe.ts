import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchAttendance',
  pure: false
})
export class SearchAttendancePipe implements PipeTransform {

  transform(subjectList: any, filterData: any) {
    debugger
    if (!subjectList) return [];
    if (!filterData) return subjectList;
    return subjectList.filter((item: any) => {

      //  item.CreationOn.indexOf(filterData) != -1 || 
      item.Shifts?.toLowerCase().indexOf(filterData) != -1
    })
  }
}
