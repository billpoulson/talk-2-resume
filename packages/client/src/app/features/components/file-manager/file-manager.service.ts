// import { Injectable } from '@angular/core'
// import { Observable, of } from 'rxjs'

// export interface FileData {
//   name: string
//   key: string
//   parent: string | null
//   isFolder: boolean
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class FileManagerService {
//   private mockData: FileData[] = [
//     { name: 'Folder 1', key: '1', parent: null, isFolder: true },
//     { name: 'Folder 2', key: '2', parent: null, isFolder: true },
//     { name: 'File 1-1', key: '3', parent: '1', isFolder: false },
//     { name: 'File 1-2', key: '4', parent: '1', isFolder: false },
//     { name: 'Subfolder 1-1', key: '5', parent: '1', isFolder: true },
//     { name: 'File 2-1', key: '6', parent: '2', isFolder: false },
//     { name: 'Nested Folder', key: '7', parent: '5', isFolder: true },
//     { name: 'Nested File', key: '8', parent: '7', isFolder: false },
//   ];

//   /**
//    * Fetches files/folders for a given parent key.
//    * If parentKey is null, returns root-level nodes.
//    */
//   getFiles(parentKey: string | null): Observable<FileData[]> {
//     const filteredData = this.mockData.filter((item) => item.parent === parentKey)
//     return of(filteredData)
//   }
// }